
import { useToast } from "@/hooks/use-toast";

interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly context: string;
  public readonly isOperational: boolean;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', context: string = '', isOperational: boolean = true) {
    super(message);
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: unknown, context?: string) => {
    console.error('Error in context:', context, error);

    let errorMessage = 'Ocorreu um erro inesperado';
    let errorCode = 'UNKNOWN_ERROR';

    if (error instanceof AppError) {
      errorMessage = error.message;
      errorCode = error.code;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Sanitize error message for user display
    const userFriendlyMessage = sanitizeErrorMessage(errorMessage);

    toast({
      title: "Erro",
      description: userFriendlyMessage,
      variant: "destructive",
    });

    // Log error for monitoring (in production, this would go to a service like Sentry)
    logError(error, context, errorCode);
  };

  const sanitizeErrorMessage = (message: string): string => {
    // Remove sensitive information from error messages
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /key/i,
      /secret/i,
      /api_key/i
    ];

    let sanitized = message;
    sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  };

  const logError = (error: unknown, context?: string, code?: string) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      context,
      code,
      stack: error instanceof Error ? error.stack : undefined,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service (Sentry, LogRocket, etc.)
      console.error('[PRODUCTION ERROR]', errorLog);
    } else {
      console.error('[DEV ERROR]', errorLog);
    }
  };

  return { handleError, AppError };
};

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) => {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  return WrappedComponent;
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; resetError: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error} 
            resetError={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Algo deu errado</h2>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
