import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  organization_role: string;
}

export const useOrganizationUsers = () => {
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && profile?.organization_id) {
      fetchOrganizationUsers();
    }
  }, [user, profile?.organization_id]);

  const fetchOrganizationUsers = async () => {
    if (!profile?.organization_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar usuários da organização com join nas tabelas
      const { data, error } = await supabase
        .from('organization_users')
        .select(`
          id,
          role,
          is_active,
          created_at,
          user:user_id (
            id,
            name,
            email,
            role,
            is_active
          )
        `)
        .eq('organization_id', profile.organization_id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching organization users:', error);
        throw error;
      }

      // Transformar dados para formato esperado
      const transformedUsers = (data || []).map((item: any) => ({
        id: item.user.id,
        name: item.user.name,
        email: item.user.email,
        role: item.user.role,
        is_active: item.user.is_active && item.is_active,
        created_at: item.created_at,
        organization_role: item.role
      }));

      setUsers(transformedUsers);
    } catch (error: any) {
      console.error('Error in fetchOrganizationUsers:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (email: string, name: string, role: string = 'member') => {
    if (!profile?.organization_id) {
      toast({
        title: "Erro",
        description: "Organização não encontrada",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verificar limite do plano antes de convidar
      const { data: limitCheck, error: limitError } = await supabase
        .rpc('check_organization_user_limit', {
          p_organization_id: profile.organization_id
        });

      if (limitError) throw limitError;

      if (!limitCheck) {
        toast({
          title: "Limite atingido",
          description: "Você atingiu o limite de usuários do seu plano atual",
          variant: "destructive",
        });
        return;
      }

      // Criar convite
      const { error } = await supabase
        .from('user_invitations')
        .insert({
          email,
          name,
          role,
          organization_id: profile.organization_id,
          invited_by: user?.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${email}`,
      });

      // Refrescar lista
      fetchOrganizationUsers();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast({
        title: "Erro ao enviar convite",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeUser = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName} da organização?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('organization_users')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('organization_id', profile?.organization_id);

      if (error) throw error;

      toast({
        title: "Usuário removido",
        description: `${userName} foi removido da organização`,
      });

      // Refrescar lista
      fetchOrganizationUsers();
    } catch (error: any) {
      console.error('Error removing user:', error);
      toast({
        title: "Erro ao remover usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('organization_users')
        .update({ role: newRole })
        .eq('user_id', userId)
        .eq('organization_id', profile?.organization_id);

      if (error) throw error;

      toast({
        title: "Papel atualizado",
        description: "Papel do usuário foi atualizado com sucesso",
      });

      // Refrescar lista
      fetchOrganizationUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erro ao atualizar papel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    users,
    loading,
    inviteUser,
    removeUser,
    updateUserRole,
    refreshUsers: fetchOrganizationUsers
  };
};
