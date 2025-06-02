
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { useAuth } from './useAuth';
import { PermissionManager } from '@/utils/permissions';
import { useToast } from './use-toast';

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao carregar usuários",
          description: "Tente novamente em alguns instantes",
          variant: "destructive",
        });
      } else {
        setUsers(data as UserProfile[]);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao atualizar usuário",
          description: "Tente novamente em alguns instantes",
          variant: "destructive",
        });
      } else {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, is_active: isActive } : user
          )
        );
        toast({
          title: "Usuário atualizado",
          description: "Status do usuário atualizado com sucesso",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: plan as UserProfile['plan'] })
        .eq('id', userId);

      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao atualizar plano",
          description: "Tente novamente em alguns instantes",
          variant: "destructive",
        });
      } else {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, plan: plan as UserProfile['plan'] } : user
          )
        );
        toast({
          title: "Plano atualizado",
          description: "Plano do usuário atualizado com sucesso",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao deletar usuário",
          description: "Tente novamente em alguns instantes",
          variant: "destructive",
        });
      } else {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        toast({
          title: "Usuário deletado",
          description: "Usuário deletado com sucesso",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
