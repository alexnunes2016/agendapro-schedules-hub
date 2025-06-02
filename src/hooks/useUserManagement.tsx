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
        .update({ plan: plan })
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
            user.id === userId ? { ...user, plan: plan } : user
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
    deleteUser,
    fetchUsers,
    isAdmin,
    isSuperAdmin
  };
};
