
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useOrganizationUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (!profile?.organization_id) {
      console.log('No organization_id found in profile');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching users for organization:', profile.organization_id);
      const { data, error } = await supabase
        .from('organization_users')
        .select(`
          *,
          profiles:user_id (
            name,
            email,
            is_active
          )
        `)
        .eq('organization_id', profile.organization_id);

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching organization users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários da organização",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canCreateUser = async () => {
    if (!profile?.organization_id) {
      console.log('No organization_id for plan check');
      return false;
    }

    try {
      console.log('Checking plan limits for:', profile.organization_id, profile.plan);
      const { data, error } = await supabase.rpc('check_plan_limits', {
        p_organization_id: profile.organization_id,
        p_plan: profile.plan || 'free',
        p_check_type: 'users'
      });

      if (error) {
        console.error('Error checking plan limits:', error);
        throw error;
      }
      
      console.log('Can create user:', data);
      return data;
    } catch (error) {
      console.error('Error checking user limits:', error);
      return false;
    }
  };

  const createUser = async (userData: { name: string; email: string; role?: string }) => {
    console.log('Creating user with data:', userData);
    
    if (!profile?.organization_id) {
      console.error('No organization_id found');
      toast({
        title: "Erro",
        description: "ID da organização não encontrado",
        variant: "destructive",
      });
      return false;
    }

    const canCreate = await canCreateUser();
    if (!canCreate) {
      toast({
        title: "Limite Atingido",
        description: "Você atingiu o limite de usuários do seu plano. Faça upgrade para adicionar mais usuários.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Criar convite na tabela user_invitations
      console.log('Inserting invitation for:', userData.email);
      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role || 'member',
          organization_id: profile.organization_id,
          invited_by: profile.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        throw error;
      }

      console.log('Invitation created successfully:', data);
      
      toast({
        title: "Convite Enviado",
        description: `Convite enviado para ${userData.name}. Um email de convite foi enviado para ${userData.email}.`,
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error creating user invitation:', error);
      
      // Verificar se é erro de email duplicado
      if (error.message?.includes('duplicate') || error.code === '23505') {
        toast({
          title: "Erro",
          description: "Este email já foi convidado ou já faz parte da organização",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao enviar convite para usuário. Tente novamente.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [profile?.organization_id]);

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    canCreateUser,
  };
};
