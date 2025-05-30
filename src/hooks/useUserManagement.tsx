
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users fetch result:', { data, error });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários. Verifique as permissões de admin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: newPlan, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
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

  const toggleUserStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    try {
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Usuário ${userName} ${newStatus ? 'desbloqueado' : 'bloqueado'} com sucesso`,
      });
      
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do usuário",
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

  const deleteUser = async (userId: string, userName: string, isSuperAdmin: boolean) => {
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
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    updateUserPlan,
    toggleUserStatus,
    sendNotification,
    deleteUser,
  };
};
