
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Shield, ShieldCheck, Mail, Key, Calendar, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    email_confirmed: boolean;
  };
  onToggleStatus: (userId: string, currentStatus: boolean, userName: string) => void;
  onSendNotification: (userId: string, userName: string) => void;
  onResetPassword: (userId: string, userName: string) => void;
  onToggleEmailConfirmation: (userId: string, userName: string, currentStatus: boolean) => void;
  onEditPlanExpiration: (userId: string, userName: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (userId: string, userName: string) => void;
  isSuperAdmin: boolean;
}

const UserActions = ({
  user,
  onToggleStatus,
  onSendNotification,
  onResetPassword,
  onToggleEmailConfirmation,
  onEditPlanExpiration,
  onDeleteUser,
  onEditUser,
  isSuperAdmin
}: UserActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            onEditUser(user.id, user.name);
            setIsOpen(false);
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Usuário
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            onToggleStatus(user.id, user.is_active, user.name);
            setIsOpen(false);
          }}
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
            onSendNotification(user.id, user.name);
            setIsOpen(false);
          }}
        >
          <Mail className="mr-2 h-4 w-4" />
          Enviar Notificação
        </DropdownMenuItem>

        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => {
                onResetPassword(user.id, user.name);
                setIsOpen(false);
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              Resetar Senha
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                onToggleEmailConfirmation(user.id, user.name, user.email_confirmed);
                setIsOpen(false);
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              {user.email_confirmed ? 'Desconfirmar' : 'Confirmar'} Email
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                onEditPlanExpiration(user.id, user.name);
                setIsOpen(false);
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Editar Expiração
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => {
                if (confirm(`Tem certeza que deseja excluir ${user.name}?`)) {
                  onDeleteUser(user.id);
                }
                setIsOpen(false);
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Usuário
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActions;
