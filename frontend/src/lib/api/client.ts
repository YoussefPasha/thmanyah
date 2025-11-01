import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/api.constants';
import type { ApiResponse, ApiError } from '@/types/api.types';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        console.log(`← ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        console.error('Response error:', error);

        if (error.response) {
          // Server responded with error
          const apiError: ApiError = error.response.data;
          return Promise.reject(apiError);
        } else if (error.request) {
          // Request made but no response
          return Promise.reject({
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message: 'Unable to reach the server. Please check your connection.',
            },
            timestamp: new Date().toISOString(),
          });
        } else {
          // Something else happened
          return Promise.reject({
            success: false,
            error: {
              code: 'UNKNOWN_ERROR',
              message: error.message || 'An unexpected error occurred',
            },
            timestamp: new Date().toISOString(),
          });
        }
      },
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();

