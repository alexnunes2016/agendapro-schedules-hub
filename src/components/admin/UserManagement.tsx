
import { AdminLayout } from './AdminLayout';
import { UserTable } from './UserTable';
import { UserFilters } from './UserFilters';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const UserManagement = () => {
  const { users, loading, filters, setFilters } = useUserManagement();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Usuários
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <UserFilters filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable users={users} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
