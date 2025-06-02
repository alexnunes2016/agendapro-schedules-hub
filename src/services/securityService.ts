
import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/utils/errorHandler";

export const securityService = {
  // Track user sessions for security monitoring
  async createSession(sessionToken: string, expiresAt: Date): Promise<void> {
    if (!sessionToken) {
      throw new AppError('Token de sessão é obrigatório', 'VALIDATION_ERROR');
    }

    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          session_token: sessionToken,
          ip_address: '0.0.0.0', // Will be replaced with actual IP in production
          user_agent: navigator.userAgent,
          expires_at: expiresAt.toISOString()
        });

      if (error) {
        throw new AppError(`Falha ao criar sessão: ${error.message}`, 'CREATE_SESSION_ERROR');
      }
    } catch (error: any) {
      console.error('Error creating session:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao criar sessão', 'CREATE_SESSION_UNKNOWN');
    }
  },

  // Get user's active sessions
  async getUserSessions(userId: string): Promise<any[]> {
    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 'VALIDATION_ERROR');
    }

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError(`Falha ao buscar sessões: ${error.message}`, 'FETCH_SESSIONS_ERROR');
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao buscar sessões', 'FETCH_SESSIONS_UNKNOWN');
    }
  },

  // Revoke a specific session
  async revokeSession(sessionId: string): Promise<void> {
    if (!sessionId) {
      throw new AppError('ID da sessão é obrigatório', 'VALIDATION_ERROR');
    }

    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        throw new AppError(`Falha ao revogar sessão: ${error.message}`, 'REVOKE_SESSION_ERROR');
      }
    } catch (error: any) {
      console.error('Error revoking session:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao revogar sessão', 'REVOKE_SESSION_UNKNOWN');
    }
  },

  // Get failed authentication attempts for monitoring
  async getFailedAttempts(email?: string, timeRange?: number): Promise<any[]> {
    try {
      let query = supabase
        .from('auth_attempts')
        .select('*')
        .eq('success', false)
        .order('created_at', { ascending: false })
        .limit(100);

      if (email) {
        query = query.eq('email', email);
      }

      if (timeRange) {
        const timeAgo = new Date(Date.now() - timeRange).toISOString();
        query = query.gte('created_at', timeAgo);
      }

      const { data, error } = await query;

      if (error) {
        throw new AppError(`Falha ao buscar tentativas: ${error.message}`, 'FETCH_ATTEMPTS_ERROR');
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching failed attempts:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Erro ao buscar tentativas de login', 'FETCH_ATTEMPTS_UNKNOWN');
    }
  },

  // Log security events
  async logSecurityEvent(action: string, tableName: string, recordId?: string, details?: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action,
          table_name: tableName,
          record_id: recordId,
          new_values: details || null,
          ip_address: '0.0.0.0', // Will be replaced with actual IP in production
          user_agent: navigator.userAgent
        });

      if (error) {
        console.warn('Failed to log security event:', error);
      }
    } catch (error) {
      console.warn('Security logging error:', error);
    }
  },

  // Check if user has required role
  async checkUserRole(userId: string, requiredRole: 'admin' | 'super_admin'): Promise<boolean> {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', requiredRole)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
};
