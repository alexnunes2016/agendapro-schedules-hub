import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/utils/errorHandler";
import { UserProfile } from "@/types/auth";

export const userService = {
  async fetchUsers(): Promise<UserProfile[]> {
    console.log('Fetching users...');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users fetch result:', { data, error });

      if (error) {
        console.error('Error details:', error);
        throw new AppError(`Falha ao carregar usuários: ${error.message}`, 'FETCH_USERS_ERROR');
      }
      
      // Garantir que os dados retornados estão no formato correto
      const users = (data || []).map(user => ({
        ...user,
        plan: user.plan as 'free' | 'basico' | 'profissional' | 'premium', // Cast para o tipo correto
        role: user.role as 'user' | 'admin'
      }));
      
      return users as UserProfile[];
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro desconhecido ao carregar usuários', 'FETCH_USERS_UNKNOWN');
    }
  },

  async updateUserPlan(userId: string, newPlan: string): Promise<void> {
    if (!userId || !newPlan) {
      throw new AppError('ID do usuário e plano são obrigatórios', 'VALIDATION_ERROR');
    }

    const validPlans = ['free', 'basico', 'profissional', 'premium'];
    if (!validPlans.includes(newPlan)) {
      throw new AppError('Plano inválido', 'INVALID_PLAN');
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
        throw new AppError(`Falha ao atualizar plano: ${error.message}`, 'UPDATE_PLAN_ERROR');
      }
    } catch (error: any) {
      console.error('Error in updateUserPlan:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao atualizar plano do usuário', 'UPDATE_PLAN_UNKNOWN');
    }
  },

  async toggleUserStatus(userId: string, newStatus: boolean): Promise<void> {
    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 'VALIDATION_ERROR');
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
        throw new AppError(`Falha ao alterar status: ${error.message}`, 'TOGGLE_STATUS_ERROR');
      }
    } catch (error: any) {
      console.error('Error in toggleUserStatus:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao alterar status do usuário', 'TOGGLE_STATUS_UNKNOWN');
    }
  },

  async resetUserPassword(userId: string): Promise<void> {
    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 'VALIDATION_ERROR');
    }

    try {
      const { error } = await supabase.rpc('secure_admin_reset_user_password', {
        p_user_id: userId
      });

      if (error) {
        throw new AppError(`Falha ao resetar senha: ${error.message}`, 'RESET_PASSWORD_ERROR');
      }
    } catch (error: any) {
      console.error('Error in resetUserPassword:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao resetar senha', 'RESET_PASSWORD_UNKNOWN');
    }
  },

  async toggleEmailConfirmation(userId: string, newStatus: boolean): Promise<void> {
    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 'VALIDATION_ERROR');
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
        throw new AppError(`Falha ao alterar confirmação de email: ${error.message}`, 'TOGGLE_EMAIL_ERROR');
      }
    } catch (error: any) {
      console.error('Error in toggleEmailConfirmation:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao alterar confirmação de email', 'TOGGLE_EMAIL_UNKNOWN');
    }
  },

  async updatePlanExpiration(userId: string, newDate: string): Promise<void> {
    if (!userId || !newDate) {
      throw new AppError('ID do usuário e data são obrigatórios', 'VALIDATION_ERROR');
    }

    // Validate date format
    const date = new Date(newDate);
    if (isNaN(date.getTime())) {
      throw new AppError('Data inválida', 'INVALID_DATE');
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
        throw new AppError(`Falha ao atualizar expiração: ${error.message}`, 'UPDATE_EXPIRATION_ERROR');
      }
    } catch (error: any) {
      console.error('Error in updatePlanExpiration:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao atualizar expiração do plano', 'UPDATE_EXPIRATION_UNKNOWN');
    }
  },

  async deleteUser(userId: string): Promise<void> {
    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 'VALIDATION_ERROR');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new AppError(`Falha ao excluir usuário: ${error.message}`, 'DELETE_USER_ERROR');
      }
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao excluir usuário', 'DELETE_USER_UNKNOWN');
    }
  },

  async validateUserPermissions(userId: string, requiredLevel: 'user' | 'admin' | 'super_admin'): Promise<boolean> {
    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 'VALIDATION_ERROR');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_active, email')
        .eq('id', userId)
        .single();

      if (error) {
        throw new AppError(`Falha ao verificar permissões: ${error.message}`, 'PERMISSION_CHECK_ERROR');
      }

      const userRole = data?.role as 'user' | 'admin';
      const isActive = data?.is_active;
      const userEmail = data?.email;
      
      if (!isActive) {
        return false;
      }

      // Verificar se é super admin (admin + email específico)
      const isSuperAdmin = userRole === 'admin' && userEmail === 'suporte@judahtech.com.br';
      
      // Hierarquia de permissões
      const hierarchy = { user: 1, admin: 2, super_admin: 3 };
      const effectiveLevel = isSuperAdmin ? 'super_admin' : userRole;
      
      return hierarchy[effectiveLevel] >= hierarchy[requiredLevel];
    } catch (error: any) {
      console.error('Error in validateUserPermissions:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao verificar permissões do usuário', 'PERMISSION_CHECK_UNKNOWN');
    }
  }
};
