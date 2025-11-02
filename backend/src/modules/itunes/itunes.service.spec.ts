import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ITunesService } from './itunes.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ITunesService', () => {
  let service: ITunesService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'app.itunesApiUrl': 'https://itunes.apple.com',
        'app.itunesApiTimeout': 10000,
        'app.itunesApiRetryAttempts': 3,
        'app.itunesApiRetryDelay': 100, // Reduced for testing
        'app.itunesApiRateLimitRetryAttempts': 5,
        'app.itunesApiRateLimitBackoffMultiplier': 2,
        'app.itunesApiCacheTtl': 300000,
        'app.itunesApiMaxRequestsPerSecond': 20,
      };
      return config[key];
    }),
  };

  const mockAxiosInstance = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ITunesService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ITunesService>(ITunesService);
    configService = module.get<ConfigService>(ConfigService);

    // Fast-forward past the constructor's setInterval
    jest.advanceTimersByTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('searchPodcasts', () => {
    const mockSearchParams = {
      term: 'test podcast',
      country: 'us',
      limit: 20,
      offset: 0,
    };

    const mockResponse = {
      data: {
        resultCount: 1,
        results: [
          {
            trackId: 123,
            trackName: 'Test Podcast',
            artistName: 'Test Artist',
          },
        ],
      },
      status: 200,
    };

    it('should successfully search podcasts', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.searchPodcasts(mockSearchParams);

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          term: 'test podcast',
          country: 'us',
          media: 'podcast',
          entity: 'podcast',
          limit: 20,
          offset: 0,
        },
      });
    });

    it('should return cached results on subsequent identical requests', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // First request
      const result1 = await service.searchPodcasts(mockSearchParams);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

      // Second request with same params - should use cache
      const result2 = await service.searchPodcasts(mockSearchParams);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1); // Still 1, not 2
      expect(result1).toEqual(result2);
    });

    it('should not use cache for different search terms', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await service.searchPodcasts(mockSearchParams);
      await service.searchPodcasts({ ...mockSearchParams, term: 'different' });

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should handle 302 redirect as rate limit', async () => {
      mockAxiosInstance.get
        .mockResolvedValueOnce({ status: 302 })
        .mockResolvedValueOnce(mockResponse);

      const promise = service.searchPodcasts(mockSearchParams);

      // Fast-forward through the retry delays
      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should handle 429 Too Many Requests with exponential backoff', async () => {
      const rateLimitError = {
        response: { status: 429, data: {} },
        isAxiosError: true,
      };

      mockAxiosInstance.get
        .mockRejectedValueOnce(rateLimitError)
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce(mockResponse);

      const promise = service.searchPodcasts(mockSearchParams);

      // Fast-forward through exponential backoff delays
      // First retry: 100ms, second: 200ms
      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(200);

      const result = await promise;
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
    });

    it('should throw TOO_MANY_REQUESTS after exhausting rate limit retries', async () => {
      const rateLimitError = {
        response: { status: 429, data: {} },
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(rateLimitError);

      const promise = service.searchPodcasts(mockSearchParams);

      // Fast-forward through all retry attempts
      for (let i = 0; i < 5; i++) {
        await jest.advanceTimersByTimeAsync(100 * Math.pow(2, i));
      }

      await expect(promise).rejects.toMatchObject({
        response: {
          code: 'ITUNES_RATE_LIMIT_EXCEEDED',
          message: 'iTunes API rate limit exceeded. Please try again later.',
        },
        status: HttpStatus.TOO_MANY_REQUESTS,
      });
    });

    it('should handle 503 Service Unavailable as rate limit', async () => {
      const serviceUnavailableError = {
        response: { status: 503, data: {} },
        isAxiosError: true,
      };

      mockAxiosInstance.get
        .mockRejectedValueOnce(serviceUnavailableError)
        .mockResolvedValueOnce(mockResponse);

      const promise = service.searchPodcasts(mockSearchParams);

      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toEqual(mockResponse.data);
    });

    it('should detect rate limit from x-rate-limit-remaining header', async () => {
      const rateLimitError = {
        response: {
          status: 200,
          data: {},
          headers: { 'x-rate-limit-remaining': '0' },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.get
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce(mockResponse);

      const promise = service.searchPodcasts(mockSearchParams);

      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toEqual(mockResponse.data);
    });

    it('should retry on regular errors with fixed delay', async () => {
      const networkError = {
        request: {},
        isAxiosError: true,
      };

      mockAxiosInstance.get
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockResponse);

      const promise = service.searchPodcasts(mockSearchParams);

      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should throw BAD_GATEWAY after exhausting regular retries', async () => {
      const networkError = {
        request: {},
        message: 'Network error',
        isAxiosError: true,
      };

      mockAxiosInstance.get.mockRejectedValue(networkError);

      const promise = service.searchPodcasts(mockSearchParams);

      // Fast-forward through all regular retry attempts (3 attempts)
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(100);
      }

      await expect(promise).rejects.toMatchObject({
        response: {
          code: 'ITUNES_API_ERROR',
          message: 'iTunes API is unreachable',
        },
        status: HttpStatus.BAD_GATEWAY,
      });
    });

    it('should throw INTERNAL_ERROR for unexpected errors', async () => {
      const unexpectedError = {
        message: 'Unexpected error',
      };

      mockAxiosInstance.get.mockRejectedValue(unexpectedError);

      const promise = service.searchPodcasts(mockSearchParams);

      // Fast-forward through all retry attempts
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(100);
      }

      await expect(promise).rejects.toMatchObject({
        response: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('Rate Limiting', () => {
    const mockSearchParams = {
      term: 'test',
      country: 'us',
      limit: 20,
      offset: 0,
    };

    const mockResponse = {
      data: {
        resultCount: 0,
        results: [],
      },
      status: 200,
    };

    it('should throttle requests to stay within rate limit', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Create 25 requests (exceeds the 20 per second limit)
      const promises = [];
      for (let i = 0; i < 25; i++) {
        promises.push(
          service.searchPodcasts({
            ...mockSearchParams,
            term: `test-${i}`, // Different terms to avoid cache
          }),
        );
      }

      // Advance time to allow rate limiting to work
      await jest.advanceTimersByTimeAsync(2000);

      await Promise.all(promises);

      // Should have made all requests eventually
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(25);
    });
  });

  describe('Cache Management', () => {
    const mockSearchParams = {
      term: 'test',
      country: 'us',
      limit: 20,
      offset: 0,
    };

    const mockResponse = {
      data: {
        resultCount: 0,
        results: [],
      },
      status: 200,
    };

    it('should expire cache entries after TTL', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // First request
      await service.searchPodcasts(mockSearchParams);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

      // Fast-forward past the cache TTL (5 minutes)
      jest.advanceTimersByTime(301000);

      // Second request - cache should be expired
      await service.searchPodcasts(mockSearchParams);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should cleanup expired cache entries periodically', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Make several requests with different terms
      await service.searchPodcasts({ ...mockSearchParams, term: 'test1' });
      await service.searchPodcasts({ ...mockSearchParams, term: 'test2' });
      await service.searchPodcasts({ ...mockSearchParams, term: 'test3' });

      // Fast-forward past cache TTL
      jest.advanceTimersByTime(301000);

      // Trigger cache cleanup (runs every 10 minutes)
      jest.advanceTimersByTime(600000);

      // After cleanup, old entries should be removed
      // New requests should hit the API again
      await service.searchPodcasts({ ...mockSearchParams, term: 'test1' });
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // 3 initial + 1 after cleanup
    });
  });

  describe('Edge Cases', () => {
    it('should handle default parameters correctly', async () => {
      const mockResponse = {
        data: {
          resultCount: 0,
          results: [],
        },
        status: 200,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await service.searchPodcasts({ term: 'test' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search', {
        params: {
          term: 'test',
          country: 'us',
          media: 'podcast',
          entity: 'podcast',
          limit: 20,
          offset: 0,
        },
      });
    });
  });
});

