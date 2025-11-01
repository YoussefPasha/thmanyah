import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ITunesSearchParams } from './interfaces/itunes-api.interface';
import { ITunesSearchResponse } from '../podcast/interfaces/itunes-response.interface';

@Injectable()
export class ITunesService {
  private readonly logger = new Logger(ITunesService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('app.itunesApiUrl');
    this.timeout = this.configService.get<number>('app.itunesApiTimeout');
    this.retryAttempts = this.configService.get<number>('app.itunesApiRetryAttempts');
    this.retryDelay = this.configService.get<number>('app.itunesApiRetryDelay');

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'iTunes-Podcast-Search/1.0',
      },
    });
  }

  async searchPodcasts(params: ITunesSearchParams): Promise<ITunesSearchResponse> {
    const { term, country = 'us', limit = 20, offset = 0 } = params;

    this.logger.debug(`Searching iTunes for podcasts with term: ${term}`);

    const searchParams = {
      term,
      country,
      media: 'podcast',
      entity: 'podcast',
      limit,
      offset,
    };

    return this.executeWithRetry(() =>
      this.axiosInstance.get<ITunesSearchResponse>('/search', {
        params: searchParams,
      }),
    );
  }

  private async executeWithRetry(
    requestFn: () => Promise<any>,
    attempt: number = 1,
  ): Promise<any> {
    try {
      const response = await requestFn();
      this.logger.debug(`iTunes API request successful on attempt ${attempt}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (attempt < this.retryAttempts) {
        this.logger.warn(
          `iTunes API request failed on attempt ${attempt}. Retrying in ${this.retryDelay}ms...`,
        );
        await this.delay(this.retryDelay);
        return this.executeWithRetry(requestFn, attempt + 1);
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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

