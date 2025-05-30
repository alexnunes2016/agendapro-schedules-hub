
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./UserActions";
import { UserPlanSelect } from "./UserPlanSelect";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";

interface UserManagementTableProps {
  filteredUsers: any[];
}

export const UserManagementTable = ({ filteredUsers }: UserManagementTableProps) => {
  const { isSuperAdmin } = useSuperAdminCheck();
  const {
    updateUserPlan,
    toggleUserStatus,
    sendNotification,
    resetPassword,
    toggleEmailConfirmation,
    editPlanExpiration,
    deleteUser,
  } = useUserManagement();

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planColors = {
      free: "bg-gray-100 text-gray-800",
      basico: "bg-blue-100 text-blue-800", 
      profissional: "bg-purple-100 text-purple-800",
      premium: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <Badge className={`${planColors[plan as keyof typeof planColors] || planColors.free} hover:bg-current`}>
        {plan === 'free' ? '14 dias teste' : plan}
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email Confirmado</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Expira em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserPlanSelect
                  currentPlan={user.plan}
                  onPlanChange={(newPlan) => updateUserPlan(user.id, newPlan)}
                />
              </TableCell>
              <TableCell>{getStatusBadge(user.is_active)}</TableCell>
              <TableCell>
                <Badge variant={user.email_confirmed ? "default" : "secondary"}>
                  {user.email_confirmed ? "Sim" : "Não"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>{formatDate(user.plan_expires_at)}</TableCell>
              <TableCell>
                <UserActions
                  user={user}
                  onToggleStatus={(userId, currentStatus, userName) => 
                    toggleUserStatus(userId, currentStatus, userName)
                  }
                  onSendNotification={(userId, userName) => 
                    sendNotification(userId, userName)
                  }
                  onResetPassword={(userId, userName) => 
                    resetPassword(userId, userName)
                  }
                  onToggleEmailConfirmation={(userId, userName, currentStatus) =>
                    toggleEmailConfirmation(userId, userName, currentStatus)
                  }
                  onEditPlanExpiration={(userId, userName) =>
                    editPlanExpiration(userId, userName)
                  }
                  onDeleteUser={(userId, userName) =>
                    deleteUser(userId, userName, isSuperAdmin)
                  }
                  isSuperAdmin={isSuperAdmin}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
