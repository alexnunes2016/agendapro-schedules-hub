
import { Button } from "@/components/ui/button";
import { Bell, Lock, Trash2, Key, CheckCircle, Calendar } from "lucide-react";

interface UserActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    email_confirmed: boolean;
    is_active: boolean;
  };
  onSendNotification: (userId: string, userName: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean, userName: string) => void;
  onDeleteUser: (userId: string, userName: string) => void;
  onResetPassword: (userId: string, userName: string) => void;
  onToggleEmailConfirmation: (userId: string, userName: string, currentStatus: boolean) => void;
  onEditPlanExpiration: (userId: string, userName: string) => void;
  isSuperAdmin: boolean;
}

const UserActions = ({ 
  user,
  onSendNotification, 
  onToggleStatus, 
  onDeleteUser,
  onResetPassword,
  onToggleEmailConfirmation,
  onEditPlanExpiration,
  isSuperAdmin 
}: UserActionsProps) => {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSendNotification(user.id, user.name)}
        title="Enviar notificação"
      >
        <Bell className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleStatus(user.id, user.is_active, user.name)}
        title="Bloquear/Desbloquear usuário"
      >
        <Lock className="h-4 w-4 text-orange-500" />
      </Button>
      {isSuperAdmin && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetPassword(user.id, user.name)}
            title="Resetar senha"
          >
            <Key className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleEmailConfirmation(user.id, user.name, user.email_confirmed)}
            title={user.email_confirmed ? "Desconfirmar email" : "Confirmar email"}
          >
            <CheckCircle className={`h-4 w-4 ${user.email_confirmed ? 'text-green-500' : 'text-gray-400'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditPlanExpiration(user.id, user.name)}
            title="Editar expiração do plano"
          >
            <Calendar className="h-4 w-4 text-purple-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteUser(user.id, user.name)}
            title="Excluir usuário"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </>
      )}
    </div>
  );
};

export default UserActions;
