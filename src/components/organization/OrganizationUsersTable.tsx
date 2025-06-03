import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Shield, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization_role: string;
  is_active: boolean;
  created_at: string;
}

interface OrganizationUsersTableProps {
  users: OrganizationUser[];
}

const OrganizationUsersTable = ({ users }: OrganizationUsersTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      owner: "bg-purple-100 text-purple-800",
      admin: "bg-red-100 text-red-800",
      member: "bg-blue-100 text-blue-800"
    };
    
    const roleLabels = {
      owner: "Proprietário",
      admin: "Administrador", 
      member: "Membro"
    };

    return (
      <Badge className={`${roleColors[role as keyof typeof roleColors] || roleColors.member} hover:bg-current`}>
        {roleLabels[role as keyof typeof roleLabels] || role}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Adicionado em</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{getRoleBadge(user.organization_role)}</TableCell>
              <TableCell>{getStatusBadge(user.is_active)}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border shadow-lg">
                    <DropdownMenuItem className="cursor-pointer">
                      <Mail className="mr-2 h-4 w-4" />
                      Reenviar convite
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Alterar função
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover usuário
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrganizationUsersTable;
