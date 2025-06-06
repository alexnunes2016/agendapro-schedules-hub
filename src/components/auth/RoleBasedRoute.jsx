
import { Navigate } from 'react-router-dom';
import { useTenantAuth } from '@/hooks/useTenantAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  fallbackPath = '/dashboard'
}) => {
  const { user, userRole, hasPermission, loading } = useTenantAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verificando permissões..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Acesso Negado</span>
            </CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta área. 
              Role necessária: {allowedRoles.join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={() => window.history.back()}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Voltar
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Permissões Insuficientes</span>
              </CardTitle>
              <CardDescription>
                Você não tem as permissões necessárias para acessar esta área.
                Permissões necessárias: {requiredPermissions.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button 
                onClick={() => window.history.back()}
                className="text-blue-600 hover:underline text-sm"
              >
                ← Voltar
              </button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
