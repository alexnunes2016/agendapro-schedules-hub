
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserFetching } from '@/hooks/useUserFetching';
import { useRoleCheck } from '@/hooks/useRoleCheck';

export const useSecureUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchUsers } = useUserFetching();
  const { isSuperAdmin } = useRoleCheck();

  const auditLog = async (action: string, tableName: string, recordId?: string, oldValues?: any, newValues?: any) => {
    try {
      if (!isSuperAdmin) return; // Only log for super admins

      // For now, we'll log to system_settings until audit_logs table is available in types
      const { error } = await supabase
        .from('system_settings')
        .insert({
          setting_key: 'audit_log',
          setting_value: {
            action,
            table_name: tableName,
            record_id: recordId,
            old_values: oldValues || null,
            new_values: newValues || null,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        });

      if (error) {
        console.warn('Failed to create audit log:', error);
      }
    } catch (error) {
      console.warn('Audit logging error:', error);
    }
  };

  const resetPassword = async (userId: string, userName: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Apenas super administradores podem resetar senhas",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Use the existing admin_reset_user_password function with a temporary password
      const { data, error } = await supabase.rpc('admin_reset_user_password', {
        p_user_id: userId,
        p_new_password: 'temp123456' // Temporary password - should be changed on first login
      });

      if (error) {
        throw error;
      }

      await auditLog('password_reset', 'profiles', userId, null, { action: 'password_reset_requested' });

      toast({
        title: "Senha Resetada",
        description: `Senha do usuário ${userName} foi resetada para: temp123456`,
      });

    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao resetar senha",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Apenas super administradores podem alterar planos",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get current user data for audit
      const { data: currentUser } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single();

      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      await auditLog('plan_change', 'profiles', userId, { plan: currentUser?.plan }, { plan: newPlan });

      toast({
        title: "Plano Atualizado",
        description: `Plano alterado para ${newPlan} com sucesso`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar plano do usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Apenas super administradores podem excluir usuários",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setLoading(true);

      // Get user data for audit before deletion
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await auditLog('user_delete', 'profiles', userId, userData, null);

      toast({
        title: "Usuário Excluído",
        description: `${userName} foi excluído com sucesso`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    resetPassword,
    updateUserPlan,
    deleteUser,
    auditLog
  };
};
