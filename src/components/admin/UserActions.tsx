
import { Button } from "@/components/ui/button";
import { Bell, Lock, Trash2 } from "lucide-react";

interface UserActionsProps {
  userId: string;
  userName: string;
  onSendNotification: (userId: string, userName: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean, userName: string) => void;
  onDeleteUser: (userId: string, userName: string) => void;
  isSuperAdmin: boolean;
}

const UserActions = ({ 
  userId, 
  userName, 
  onSendNotification, 
  onToggleStatus, 
  onDeleteUser, 
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteUser(userId, userName)}
          title="Excluir usuário"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </div>
  );
};

export default UserActions;
