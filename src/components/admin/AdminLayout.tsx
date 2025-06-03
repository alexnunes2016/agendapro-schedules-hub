
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Card } from '@/components/ui/card';

interface AdminLayoutProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

export const AdminLayout = ({ children, requireSuperAdmin = false }: AdminLayoutProps) => {
  const { isAdmin, isSuperAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || (requireSuperAdmin && !isSuperAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};
