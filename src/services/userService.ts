
import { supabase } from "@/integrations/supabase/client";

export const userService = {
  async fetchUsers() {
    console.log('Fetching users...');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users fetch result:', { data, error });

      if (error) {
        console.error('Error details:', error);
        throw new Error(`Falha ao carregar usuários: ${error.message}`);
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      throw new Error(error.message || 'Erro desconhecido ao carregar usuários');
    }
  },

  async updateUserPlan(userId: string, newPlan: string) {
    if (!userId || !newPlan) {
      throw new Error('ID do usuário e plano são obrigatórios');
    }

    const validPlans = ['free', 'basico', 'profissional', 'premium'];
    if (!validPlans.includes(newPlan)) {
      throw new Error('Plano inválido');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: newPlan, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) {
        throw new Error(`Falha ao atualizar plano: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in updateUserPlan:', error);
      throw new Error(error.message || 'Erro ao atualizar plano do usuário');
    }
  },

  async toggleUserStatus(userId: string, newStatus: boolean) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) {
        throw new Error(`Falha ao alterar status: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in toggleUserStatus:', error);
      throw new Error(error.message || 'Erro ao alterar status do usuário');
    }
  },

  async resetUserPassword(userId: string) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const { error } = await supabase.rpc('secure_admin_reset_user_password', {
        p_user_id: userId
      });

      if (error) {
        throw new Error(`Falha ao resetar senha: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in resetUserPassword:', error);
      throw new Error(error.message || 'Erro ao resetar senha');
    }
  },

  async toggleEmailConfirmation(userId: string, newStatus: boolean) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          email_confirmed: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) {
        throw new Error(`Falha ao alterar confirmação de email: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in toggleEmailConfirmation:', error);
      throw new Error(error.message || 'Erro ao alterar confirmação de email');
    }
  },

  async updatePlanExpiration(userId: string, newDate: string) {
    if (!userId || !newDate) {
      throw new Error('ID do usuário e data são obrigatórios');
    }

    // Validate date format
    const date = new Date(newDate);
    if (isNaN(date.getTime())) {
      throw new Error('Data inválida');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan_expires_at: date.toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) {
        throw new Error(`Falha ao atualizar expiração: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in updatePlanExpiration:', error);
      throw new Error(error.message || 'Erro ao atualizar expiração do plano');
    }
  },

  async deleteUser(userId: string) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(`Falha ao excluir usuário: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      throw new Error(error.message || 'Erro ao excluir usuário');
    }
  }
};
