import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { useAuth } from './useAuth';
import { PermissionManager } from '@/utils/permissions';
import { useToast } from './use-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "basico" | "profissional" | "premium";
  is_active: boolean;
  email_confirmed: boolean;
  plan_expires_at?: string;
  organization_id?: string;
  clinic_name?: string;
  service_type?: string;
  created_at: string;
  updated_at: string;
  plan_updated_by?: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const isSuperAdmin = PermissionManager.isSuperAdminSync(profile);
      
      if (isSuperAdmin) {
        // Usar função segura para superadmin buscar todos os usuários
        const { data, error } = await supabase.rpc('get_all_users_for_admin');
        
        if (error) {
          throw error;
        }
        
        setUsers(data as UserProfile[]);
      } else {
        // Para admins normais, buscar apenas usuários da organização
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('organization_id', profile?.organization_id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        setUsers(data as UserProfile[]);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar usuários",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, is_active: isActive } : user
        )
      );
      
      toast({
        title: "Usuário atualizado",
        description: "Status do usuário atualizado com sucesso",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar usuário",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const updateUserPlan = async (userId: string, plan: UserProfile['plan']) => {
    try {
      // Primeiro, verificar se o plano é válido
      const validPlans: UserProfile['plan'][] = ['free', 'basico', 'profissional', 'premium'];
      if (!validPlans.includes(plan)) {
        throw new Error('Plano inválido');
      }

      // Atualizar no Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: plan,
          updated_at: new Date().toISOString(),
          plan_updated_by: profile?.id
        })
        .eq('id', userId);

      if (error) throw error;

      // Atualizar o estado local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId 
            ? { 
                ...user, 
                plan: plan,
                updated_at: new Date().toISOString(),
                plan_updated_by: profile?.id
              } 
            : user
        )
      );
      
      toast({
        title: "Plano atualizado",
        description: "Plano do usuário atualizado com sucesso",
      });

      // Recarregar os dados para garantir sincronização
      await fetchUsers();
    } catch (err: any) {
      console.error('Error updating user plan:', err);
      toast({
        title: "Erro ao atualizar plano",
        description: err.message || "Erro ao atualizar plano do usuário",
        variant: "destructive",
      });
      // Recarregar os dados em caso de erro para garantir consistência
      await fetchUsers();
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    await updateUserStatus(userId, !currentStatus);
  };

  const sendNotification = async (userId: string, userName: string) => {
    toast({
      title: "Notificação Enviada",
      description: `Notificação enviada para ${userName}`,
    });
  };

  const resetPassword = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja resetar a senha do usuário ${userName}?`)) {
      return;
    }

    try {
      const { error } = await supabase.rpc('secure_admin_reset_user_password', {
        p_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Senha Resetada",
        description: `Solicitação de reset de senha enviada para ${userName}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao resetar senha do usuário",
        variant: "destructive",
      });
    }
  };

  const toggleEmailConfirmation = async (userId: string, userName: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('profiles')
        .update({ email_confirmed: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, email_confirmed: newStatus } : user
        )
      );

      toast({
        title: "Sucesso",
        description: `Email do usuário ${userName} ${newStatus ? 'confirmado' : 'desconfirmado'} com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao alterar confirmação do email",
        variant: "destructive",
      });
    }
  };

  const editPlanExpiration = async (userId: string, userName: string) => {
    const newDate = prompt(`Digite a nova data de expiração para ${userName} (YYYY-MM-DD):`);
    if (!newDate) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan_expires_at: newDate })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, plan_expires_at: newDate } : user
        )
      );

      toast({
        title: "Sucesso",
        description: `Data de expiração do plano de ${userName} atualizada`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar data de expiração",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast({
        title: "Usuário deletado",
        description: "Usuário deletado com sucesso",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao deletar usuário",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = user.name.toLowerCase().includes(searchTermLower);
    const emailMatch = user.email.toLowerCase().includes(searchTermLower);
    const statusMatch = statusFilter === 'all' ||
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);

    return (nameMatch || emailMatch) && statusMatch;
  });

  const isAdmin = PermissionManager.isAdminSync(profile);
  const isSuperAdmin = PermissionManager.isSuperAdminSync(profile);

  return {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredUsers,
    updateUserStatus,
    updateUserPlan,
    toggleUserStatus,
    sendNotification,
    resetPassword,
    toggleEmailConfirmation,
    editPlanExpiration,
    deleteUser,
    fetchUsers,
    isAdmin,
    isSuperAdmin
  };
};
