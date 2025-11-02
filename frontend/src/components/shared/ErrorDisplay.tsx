import { AlertCircle, WifiOff, Clock, ServerCrash, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  errorCode?: number | string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorDisplay({
  title,
  message,
  errorCode,
  onRetry,
  showRetry = true,
  className = '',
}: ErrorDisplayProps) {
  // Determine icon and default messages based on error code
  const getErrorDetails = () => {
    const code = typeof errorCode === 'string' ? parseInt(errorCode) : errorCode;

    switch (code) {
      case 404:
        return {
          icon: <AlertCircle className="h-12 w-12" />,
          defaultTitle: 'غير موجود',
          defaultMessage: 'المحتوى الذي تبحث عنه غير موجود.',
          color: 'text-yellow-600 dark:text-yellow-500',
        };
      case 429:
        return {
          icon: <Clock className="h-12 w-12" />,
          defaultTitle: 'تم تجاوز الحد المسموح',
          defaultMessage: 'لقد تجاوزت الحد المسموح من الطلبات. يرجى الانتظار قليلاً.',
          color: 'text-orange-600 dark:text-orange-500',
        };
      case 500:
      case 502:
      case 503:
        return {
          icon: <ServerCrash className="h-12 w-12" />,
          defaultTitle: 'خطأ في الخادم',
          defaultMessage: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
          color: 'text-destructive',
        };
      case 403:
        return {
          icon: <ShieldAlert className="h-12 w-12" />,
          defaultTitle: 'غير مصرح',
          defaultMessage: 'ليس لديك صلاحية للوصول إلى هذا المحتوى.',
          color: 'text-destructive',
        };
      default:
        return {
          icon: <WifiOff className="h-12 w-12" />,
          defaultTitle: 'خطأ في الاتصال',
          defaultMessage: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
          color: 'text-muted-foreground',
        };
    }
  };

  const details = getErrorDetails();

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div
        className={`mb-4 rounded-full bg-muted/50 p-6 ${details.color}`}
      >
        {details.icon}
      </div>
      
      {errorCode && (
        <div className="mb-2 inline-block rounded-lg bg-muted px-3 py-1">
          <span className="text-xs font-semibold text-muted-foreground">
            خطأ {errorCode}
          </span>
        </div>
      )}
      
      <h3 className="mb-2 text-xl font-bold">
        {title || details.defaultTitle}
      </h3>
      
      <p className="mb-6 max-w-md text-muted-foreground">
        {message || details.defaultMessage}
      </p>
      
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="default">
          حاول مرة أخرى
        </Button>
      )}
    </div>
  );
}

