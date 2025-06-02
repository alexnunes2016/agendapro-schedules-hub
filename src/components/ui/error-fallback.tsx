
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  description?: string;
}

export const ErrorFallback = ({ 
  error, 
  resetError, 
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado. Por favor, tente novamente."
}: ErrorFallbackProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">{description}</p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-gray-100 p-4 rounded text-sm">
              <summary className="cursor-pointer font-medium">Detalhes do erro</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">
                {error.message}
                {error.stack && '\n\n' + error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={resetError} 
              variant="outline" 
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button 
              onClick={handleRefresh} 
              className="flex-1"
            >
              Recarregar Página
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const NetworkErrorFallback = ({ resetError }: { resetError: () => void }) => {
  return (
    <ErrorFallback
      error={new Error('Network Error')}
      resetError={resetError}
      title="Erro de Conexão"
      description="Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
    />
  );
};

export const NotFoundFallback = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            A página que você está procurando não foi encontrada.
          </p>
          <Button onClick={() => window.history.back()}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
