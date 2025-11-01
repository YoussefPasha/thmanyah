export class ResponseUtil {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, code: string, details?: any) {
    return {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
    };
  }
}

