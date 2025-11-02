import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ITunesSearchParams } from './interfaces/itunes-api.interface';
import { ITunesSearchResponse } from '../podcast/interfaces/itunes-response.interface';

interface CacheEntry {
  data: ITunesSearchResponse;
  timestamp: number;
}

interface RateLimitInfo {
  lastRequestTime: number;
  requestCount: number;
}

@Injectable()
export class ITunesService {
  private readonly logger = new Logger(ITunesService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;
  private readonly rateLimitRetryAttempts: number;
  private readonly rateLimitBackoffMultiplier: number;
  private readonly cacheTtl: number;
  private readonly maxRequestsPerSecond: number;
  
  // In-memory cache for search results
  private readonly cache: Map<string, CacheEntry> = new Map();
  
  // Rate limit tracking
  private rateLimitInfo: RateLimitInfo = {
    lastRequestTime: 0,
    requestCount: 0,
  };

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('app.itunesApiUrl') || 'https://itunes.apple.com';
    this.timeout = this.configService.get<number>('app.itunesApiTimeout') || 10000;
    this.retryAttempts = this.configService.get<number>('app.itunesApiRetryAttempts') || 3;
    this.retryDelay = this.configService.get<number>('app.itunesApiRetryDelay') || 1000;
    this.rateLimitRetryAttempts = this.configService.get<number>('app.itunesApiRateLimitRetryAttempts') || 5;
    this.rateLimitBackoffMultiplier = this.configService.get<number>('app.itunesApiRateLimitBackoffMultiplier') || 2;
    this.cacheTtl = this.configService.get<number>('app.itunesApiCacheTtl') || 300000; // 5 minutes in ms
    this.maxRequestsPerSecond = this.configService.get<number>('app.itunesApiMaxRequestsPerSecond') || 20;

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'iTunes-Podcast-Search/1.0',
      },
      maxRedirects: 0, // Don't follow redirects automatically to catch 302
      validateStatus: (status) => status < 400, // Handle 3xx responses
    });
    
    // Set up cache cleanup interval (every 10 minutes)
    setInterval(() => this.cleanupCache(), 600000);
  }

  async searchPodcasts(params: ITunesSearchParams): Promise<ITunesSearchResponse> {
    const { term, country = 'us', limit = 20, offset = 0 } = params;

    this.logger.debug(`Searching iTunes for podcasts with term: ${term}`);

    // Generate cache key
    const cacheKey = this.generateCacheKey(params);
    
    // Check cache first
    const cachedResult = this.getFromCache(cacheKey);
    if (cachedResult) {
      this.logger.debug(`Returning cached result for: ${term}`);
      return cachedResult;
    }

    // Apply rate limiting
    await this.applyRateLimit();

    const searchParams = {
      term,
      country,
      media: 'podcast',
      entity: 'podcast',
      limit,
      offset,
    };

    const result = await this.executeWithRetry(
      () =>
        this.axiosInstance.get<ITunesSearchResponse>('/search', {
          params: searchParams,
        }),
      1,
      false, // not a rate limit retry initially
    );
    
    // Cache the result
    this.saveToCache(cacheKey, result);
    
    return result;
  }

  private async executeWithRetry(
    requestFn: () => Promise<any>,
    attempt: number = 1,
    isRateLimitRetry: boolean = false,
  ): Promise<any> {
    try {
      const response = await requestFn();
      
      // Check for rate limit indicators in successful responses
      if (response.status === 302) {
        this.logger.warn(`Received 302 redirect from iTunes API - possible rate limit`);
        throw new Error('RATE_LIMITED');
      }
      
      this.logger.debug(`iTunes API request successful on attempt ${attempt}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const isRateLimited = this.isRateLimitError(axiosError);

      // Handle rate limit errors separately
      if (isRateLimited) {
        const maxAttempts = this.rateLimitRetryAttempts;
        
        if (attempt < maxAttempts) {
          // Use exponential backoff for rate limit errors
          const backoffDelay = this.calculateBackoffDelay(attempt, isRateLimitRetry);
          
          this.logger.warn(
            `iTunes API rate limit detected on attempt ${attempt}. Retrying in ${backoffDelay}ms...`,
          );
          
          await this.delay(backoffDelay);
          return this.executeWithRetry(requestFn, attempt + 1, true);
        }
        
        // Rate limit exceeded after all retries
        this.logger.error('iTunes API rate limit exceeded after all retry attempts');
        throw new HttpException(
          {
            code: 'ITUNES_RATE_LIMIT_EXCEEDED',
            message: 'iTunes API rate limit exceeded. Please try again later.',
            retryAfter: this.calculateBackoffDelay(maxAttempts, true),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Handle regular errors
      if (attempt < this.retryAttempts) {
        this.logger.warn(
          `iTunes API request failed on attempt ${attempt}. Retrying in ${this.retryDelay}ms...`,
        );
        await this.delay(this.retryDelay);
        return this.executeWithRetry(requestFn, attempt + 1, isRateLimitRetry);
      }

      this.logger.error('iTunes API request failed after all retry attempts', axiosError.message);

      if (axiosError.response) {
        throw new HttpException(
          {
            code: 'ITUNES_API_ERROR',
            message: 'Failed to fetch data from iTunes API',
            details: axiosError.response.data,
          },
          HttpStatus.BAD_GATEWAY,
        );
      } else if (axiosError.request) {
        throw new HttpException(
          {
            code: 'ITUNES_API_ERROR',
            message: 'iTunes API is unreachable',
          },
          HttpStatus.BAD_GATEWAY,
        );
      } else {
        throw new HttpException(
          {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private isRateLimitError(error: AxiosError | Error): boolean {
    // Check for explicit rate limit error
    if (error.message === 'RATE_LIMITED') {
      return true;
    }
    
    if (!axios.isAxiosError(error)) {
      return false;
    }

    const status = error.response?.status;
    const headers = error.response?.headers;

    // Check for common rate limit status codes
    if (status === 302 || status === 429 || status === 503) {
      return true;
    }

    // Check for rate limit headers
    if (headers && (headers['x-rate-limit-remaining'] === '0' || headers['retry-after'])) {
      return true;
    }

    return false;
  }

  private calculateBackoffDelay(attempt: number, isRateLimitRetry: boolean): number {
    if (!isRateLimitRetry) {
      return this.retryDelay;
    }

    // Exponential backoff: baseDelay * (multiplier ^ attempt)
    // For attempt 1: 1000ms, attempt 2: 2000ms, attempt 3: 4000ms, attempt 4: 8000ms, etc.
    const baseDelay = this.retryDelay;
    const exponentialDelay = baseDelay * Math.pow(this.rateLimitBackoffMultiplier, attempt - 1);
    
    // Cap at 60 seconds
    return Math.min(exponentialDelay, 60000);
  }

  private async applyRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.rateLimitInfo.lastRequestTime;

    // Reset counter if more than 1 second has passed
    if (timeSinceLastRequest >= 1000) {
      this.rateLimitInfo.requestCount = 0;
      this.rateLimitInfo.lastRequestTime = now;
    }

    // Check if we've exceeded the rate limit
    if (this.rateLimitInfo.requestCount >= this.maxRequestsPerSecond) {
      const waitTime = 1000 - timeSinceLastRequest;
      if (waitTime > 0) {
        this.logger.debug(`Rate limit reached, waiting ${waitTime}ms before next request`);
        await this.delay(waitTime);
        this.rateLimitInfo.requestCount = 0;
        this.rateLimitInfo.lastRequestTime = Date.now();
      }
    }

    this.rateLimitInfo.requestCount++;
  }

  private generateCacheKey(params: ITunesSearchParams): string {
    return `${params.term}-${params.country || 'us'}-${params.limit || 20}-${params.offset || 0}`;
  }

  private getFromCache(key: string): ITunesSearchResponse | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache entry is still valid
    if (age > this.cacheTtl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private saveToCache(key: string, data: ITunesSearchResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private cleanupCache(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > this.cacheTtl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.logger.debug(`Cleaned up ${removedCount} expired cache entries`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

