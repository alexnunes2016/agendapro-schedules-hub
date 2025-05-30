
import { Button } from "@/components/ui/button";
import { Bell, Lock, Trash2, Key, CheckCircle, Calendar } from "lucide-react";

interface UserActionsProps {
  userId: string;
  userName: string;
  userEmail: string;
  emailConfirmed: boolean;
  onSendNotification: (userId: string, userName: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean, userName: string) => void;
  onDeleteUser: (userId: string, userName: string) => void;
  onResetPassword: (userId: string, userName: string) => void;
  onToggleEmailConfirmation: (userId: string, userName: string, currentStatus: boolean) => void;
  onEditPlanExpiration: (userId: string, userName: string) => void;
  isSuperAdmin: boolean;
}

const UserActions = ({ 
  userId, 
  userName,
  userEmail,
  emailConfirmed,
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
        onClick={() => onSendNotification(userId, userName)}
        title="Enviar notificação"
      >
        <Bell className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleStatus(userId, true, userName)}
        title="Bloquear/Desbloquear usuário"
      >
        <Lock className="h-4 w-4 text-orange-500" />
      </Button>
      {isSuperAdmin && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetPassword(userId, userName)}
            title="Resetar senha"
          >
            <Key className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleEmailConfirmation(userId, userName, emailConfirmed)}
            title={emailConfirmed ? "Desconfirmar email" : "Confirmar email"}
          >
            <CheckCircle className={`h-4 w-4 ${emailConfirmed ? 'text-green-500' : 'text-gray-400'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditPlanExpiration(userId, userName)}
            title="Editar expiração do plano"
          >
            <Calendar className="h-4 w-4 text-purple-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteUser(userId, userName)}
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
