
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, UserFilters, UserPlan } from '@/types/admin';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    plan: 'all',
    status: 'all'
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }
      if (filters.plan !== 'all') {
        query = query.eq('plan', filters.plan);
      }
      if (filters.status !== 'all') {
        query = query.eq('is_active', filters.status === 'active');
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
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

  const updateUserPlan = async (userId: string, newPlan: UserPlan) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Plano atualizado",
        description: "Plano do usuário foi atualizado com sucesso",
      });

      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user plan:', err);
      toast({
        title: "Erro ao atualizar plano",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });

      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user status:', err);
      toast({
        title: "Erro ao atualizar status",
        description: err.message,
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

      toast({
        title: "Usuário excluído",
        description: "Usuário foi excluído com sucesso",
      });

      fetchUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: "Erro ao excluir usuário",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return {
    users,
    loading,
    error,
    filters,
    setFilters,
    updateUserPlan,
    toggleUserStatus,
    deleteUser,
    refetch: fetchUsers
  };
};
