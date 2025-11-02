import { ApiError } from '@/types/api.types';

/**
 * Utility functions for handling API errors
 */

/**
 * Checks if an error is a rate limit error (429)
 */
export function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const apiError = error as ApiError;
  return (
    apiError.error?.statusCode === 429 ||
    apiError.error?.code === 'RATE_LIMIT_ERROR' ||
    apiError.error?.message?.toLowerCase().includes('rate limit')
  );
}

/**
 * Checks if an error is a server error (5xx)
 */
export function isServerError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const apiError = error as ApiError;
  const statusCode = apiError.error?.statusCode;
  return statusCode ? statusCode >= 500 && statusCode < 600 : false;
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const apiError = error as ApiError;
  return (
    apiError.error?.code === 'NETWORK_ERROR' ||
    apiError.error?.code === 'TIMEOUT_ERROR' ||
    apiError.error?.statusCode === 0
  );
}

/**
 * Checks if an error is a not found error (404)
 */
export function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const apiError = error as ApiError;
  return (
    apiError.error?.statusCode === 404 ||
    apiError.error?.code === 'NOT_FOUND'
  );
}

/**
 * Get user-friendly error message in Arabic
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'حدث خطأ غير معروف';
  
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) return error.message;
  
  if (typeof error === 'object' && 'error' in error) {
    const apiError = error as ApiError;
    const statusCode = apiError.error?.statusCode;
    
    // Return Arabic messages based on error type
    if (isRateLimitError(error)) {
      return 'لقد تجاوزت الحد المسموح من الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.';
    }
    
    if (isNetworkError(error)) {
      return 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.';
    }
    
    if (isNotFoundError(error)) {
      return 'المحتوى المطلوب غير موجود.';
    }
    
    switch (statusCode) {
      case 500:
        return 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
      case 502:
        return 'الخادم غير متاح مؤقتاً.';
      case 503:
        return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.';
      case 504:
        return 'استغرق الطلب وقتاً طويلاً. يرجى المحاولة مرة أخرى.';
      case 403:
        return 'ليس لديك صلاحية للوصول إلى هذا المحتوى.';
      case 401:
        return 'يجب تسجيل الدخول للمتابعة.';
      case 400:
        return 'البيانات المدخلة غير صحيحة.';
      default:
        return apiError.error?.message || 'حدث خطأ أثناء معالجة طلبك.';
    }
  }
  
  return 'حدث خطأ غير معروف';
}

/**
 * Get error status code
 */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const apiError = error as ApiError;
  return apiError.error?.statusCode;
}

/**
 * Get error code
 */
export function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const apiError = error as ApiError;
  return apiError.error?.code;
}

/**
 * Format error for display
 */
export interface FormattedError {
  title: string;
  message: string;
  statusCode?: number;
  code?: string;
  isRetryable: boolean;
}

export function formatError(error: unknown): FormattedError {
  const statusCode = getErrorStatusCode(error);
  const code = getErrorCode(error);
  const message = getErrorMessage(error);
  
  let title = 'حدث خطأ';
  let isRetryable = true;
  
  if (isRateLimitError(error)) {
    title = 'تم تجاوز الحد المسموح';
    isRetryable = false;
  } else if (isServerError(error)) {
    title = 'خطأ في الخادم';
  } else if (isNetworkError(error)) {
    title = 'خطأ في الاتصال';
  } else if (isNotFoundError(error)) {
    title = 'غير موجود';
    isRetryable = false;
  } else if (statusCode === 403) {
    title = 'غير مصرح';
    isRetryable = false;
  } else if (statusCode === 401) {
    title = 'غير مصرح بالدخول';
    isRetryable = false;
  } else if (statusCode === 400) {
    title = 'طلب غير صحيح';
    isRetryable = false;
  }
  
  return {
    title,
    message,
    statusCode,
    code,
    isRetryable,
  };
}

