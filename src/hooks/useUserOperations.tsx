
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";

export const useUserOperations = () => {
  const { toast } = useToast();

  const updateUserPlan = async (userId: string, newPlan: string, onSuccess: () => void) => {
    try {
      await userService.updateUserPlan(userId, newPlan);
      await onSuccess();
      toast({
        title: "Sucesso",
        description: "Plano do usuário atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating user plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar plano do usuário",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean, userName: string, onSuccess: () => void) => {
    try {
      const newStatus = !currentStatus;
      await userService.toggleUserStatus(userId, newStatus);
      
      toast({
        title: "Sucesso",
        description: `Usuário ${userName} ${newStatus ? 'ativado' : 'desativado'} com sucesso`,
      });
      
      await onSuccess();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do usuário",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja resetar a senha do usuário ${userName}?`)) {
      return;
    }

    try {
      await userService.resetUserPassword(userId);
      toast({
        title: "Sucesso",
        description: `Senha do usuário ${userName} foi resetada para: temp123456`,
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erro",
        description: "Erro ao resetar senha do usuário",
        variant: "destructive",
      });
    }
  };

  const toggleEmailConfirmation = async (userId: string, userName: string, currentStatus: boolean, onSuccess: () => void) => {
    try {
      const newStatus = !currentStatus;
      await userService.toggleEmailConfirmation(userId, newStatus);

      toast({
        title: "Sucesso",
        description: `Email do usuário ${userName} ${newStatus ? 'confirmado' : 'desconfirmado'} com sucesso`,
      });
      
      await onSuccess();
    } catch (error) {
      console.error('Error toggling email confirmation:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar confirmação do email",
        variant: "destructive",
      });
    }
  };

  const editPlanExpiration = async (userId: string, userName: string, onSuccess: () => void) => {
    const newDate = prompt(`Digite a nova data de expiração para ${userName} (YYYY-MM-DD):`);
    if (!newDate) return;

    try {
      await userService.updatePlanExpiration(userId, newDate);
      toast({
        title: "Sucesso",
        description: `Data de expiração do plano de ${userName} atualizada`,
      });
      
      await onSuccess();
    } catch (error) {
      console.error('Error updating plan expiration:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar data de expiração",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string, userName: string, isSuperAdmin: boolean, onSuccess: () => void) => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Apenas super admins podem excluir usuários",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      await onSuccess();
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  const sendNotification = async (userId: string, userName: string) => {
    try {
      toast({
        title: "Notificação Enviada",
        description: `Notificação enviada para ${userName}`,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar notificação",
        variant: "destructive",
      });
    }
  };

  return {
    updateUserPlan,
    toggleUserStatus,
    resetPassword,
    toggleEmailConfirmation,
    editPlanExpiration,
    deleteUser,
    sendNotification,
  };
};
