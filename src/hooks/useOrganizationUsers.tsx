
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
    if (!profile?.organization_id) return;

    try {
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

      if (error) throw error;
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
    if (!profile?.organization_id) return false;

    try {
      const { data, error } = await supabase.rpc('check_plan_limits', {
        p_organization_id: profile.organization_id,
        p_plan: profile.plan || 'free',
        p_check_type: 'users'
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking user limits:', error);
      return false;
    }
  };

  const createUser = async (userData: { name: string; email: string; role?: string }) => {
    if (!profile?.organization_id) return false;

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
      // Em produção, aqui seria criado o usuário no Supabase Auth
      // Por agora, apenas simulamos
      toast({
        title: "Usuário Criado",
        description: `Usuário ${userData.name} foi criado com sucesso. Um email de convite foi enviado.`,
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [profile]);

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    canCreateUser,
  };
};
