
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Shield, ShieldCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import type { User } from '@/types/admin';

interface UserTableProps {
  users: User[];
  loading: boolean;
}

export const UserTable = ({ users, loading }: UserTableProps) => {
  const { updateUserPlan, toggleUserStatus, deleteUser } = useUserManagement();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPlanBadge = (plan: string) => {
    const planColors = {
      free: 'bg-gray-100 text-gray-800',
      basico: 'bg-blue-100 text-blue-800',
      profissional: 'bg-purple-100 text-purple-800',
      premium: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={planColors[plan as keyof typeof planColors] || planColors.free}>
        {plan === 'free' ? '14 dias teste' : plan}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      superadmin: 'bg-red-100 text-red-800',
      admin: 'bg-orange-100 text-orange-800',
      staff: 'bg-blue-100 text-blue-800',
      client: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || roleColors.client}>
        {role}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Carregando usuários...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getPlanBadge(user.plan)}</TableCell>
              <TableCell>
                <Badge variant={user.is_active ? 'default' : 'secondary'}>
                  {user.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                    >
                      {user.is_active ? (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este usuário?')) {
                          deleteUser(user.id);
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
