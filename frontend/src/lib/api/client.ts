import { API_BASE_URL } from '../constants/api.constants';
import type { ApiResponse, ApiError } from '@/types/api.types';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private buildUrl(url: string, params?: Record<string, any>): string {
    const fullUrl = `${this.baseURL}${url}`;
    
    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    return `${fullUrl}?${searchParams.toString()}`;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async handleRequest<T>(
    url: string,
    options: RequestInit,
  ): Promise<ApiResponse<T>> {
    const method = options.method || 'GET';
    console.log(`→ ${method} ${url}`);

    try {
      const response = await this.fetchWithTimeout(url, options);
      
      console.log(`← ${method} ${url} ${response.status}`);

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        // Handle specific HTTP error codes
        const statusCode = response.status;
        let errorMessage = data.message || 'An error occurred';
        let errorCode = data.error?.code || `HTTP_${statusCode}`;

        switch (statusCode) {
          case 429:
            errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
            errorCode = 'RATE_LIMIT_ERROR';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            errorCode = 'SERVER_ERROR';
            break;
          case 502:
            errorMessage = 'Bad gateway. The server is temporarily unavailable.';
            errorCode = 'BAD_GATEWAY';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            errorCode = 'SERVICE_UNAVAILABLE';
            break;
          case 504:
            errorMessage = 'Gateway timeout. The request took too long.';
            errorCode = 'GATEWAY_TIMEOUT';
            break;
          case 404:
            errorMessage = data.message || 'Resource not found.';
            errorCode = 'NOT_FOUND';
            break;
          case 403:
            errorMessage = 'Forbidden. You do not have permission to access this resource.';
            errorCode = 'FORBIDDEN';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login to continue.';
            errorCode = 'UNAUTHORIZED';
            break;
          case 400:
            errorMessage = data.message || 'Bad request. Please check your input.';
            errorCode = 'BAD_REQUEST';
            break;
        }

        // Create enhanced error with status code
        const apiError: ApiError = {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            statusCode: statusCode,
          },
          timestamp: data.timestamp || new Date().toISOString(),
        };
        
        return Promise.reject(apiError);
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      console.error('Response error:', error);

      if (error.name === 'AbortError') {
        // Request timeout
        return Promise.reject({
          success: false,
          error: {
            code: 'TIMEOUT_ERROR',
            message: 'Request timeout. Please try again.',
            statusCode: 504,
          },
          timestamp: new Date().toISOString(),
        });
      } else if (error instanceof TypeError) {
        // Network error (fetch throws TypeError for network failures)
        return Promise.reject({
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'Unable to reach the server. Please check your connection.',
            statusCode: 0,
          },
          timestamp: new Date().toISOString(),
        });
      } else if (error.error) {
        // Already formatted error from server
        return Promise.reject(error);
      } else {
        // Unknown error
        return Promise.reject({
          success: false,
          error: {
            code: 'UNKNOWN_ERROR',
            message: error.message || 'An unexpected error occurred',
            statusCode: 0,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(url, params);
    return this.handleRequest<T>(fullUrl, {
      method: 'GET',
      headers: this.defaultHeaders,
    });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(url);
    return this.handleRequest<T>(fullUrl, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(url);
    return this.handleRequest<T>(fullUrl, {
      method: 'PUT',
      headers: this.defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(url);
    return this.handleRequest<T>(fullUrl, {
      method: 'DELETE',
      headers: this.defaultHeaders,
    });
  }
}

export const apiClient = new ApiClient();

