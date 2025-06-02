
import { UserProfile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

// Centralizando toda a lógica de permissões
export class PermissionManager {
  static async isSuperAdmin(userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'super_admin')
        .single();
      
      return !!data;
    } catch {
      return false;
    }
  }

  static async isAdmin(userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['admin', 'super_admin']);
      
      return data && data.length > 0;
    } catch {
      return false;
    }
  }

  // Updated sync methods that work with profile OR user ID
  static isSuperAdminSync(profile: UserProfile | null, userId?: string): boolean {
    if (profile) {
      // Legacy check for backward compatibility
      return profile.role === 'admin' && profile.email === 'suporte@judahtech.com.br';
    }
    return false;
  }

  static isAdminSync(profile: UserProfile | null, userId?: string): boolean {
    if (profile) {
      return profile.role === 'admin';
    }
    return false;
  }

  static canManageUsers(profile: UserProfile | null): boolean {
    return this.isAdminSync(profile);
  }

  static canDeleteUsers(profile: UserProfile | null): boolean {
    return this.isSuperAdminSync(profile);
  }

  static canViewAllAppointments(profile: UserProfile | null): boolean {
    return this.isAdminSync(profile);
  }

  static canManageSystemSettings(profile: UserProfile | null): boolean {
    return this.isSuperAdminSync(profile);
  }

  static getPermissionLevel(profile: UserProfile | null): 'user' | 'admin' | 'super_admin' {
    if (this.isSuperAdminSync(profile)) return 'super_admin';
    if (this.isAdminSync(profile)) return 'admin';
    return 'user';
  }

  static validateAccess(profile: UserProfile | null, requiredLevel: 'user' | 'admin' | 'super_admin'): boolean {
    if (!profile || !profile.is_active) return false;

    const userLevel = this.getPermissionLevel(profile);
    
    // Hierarquia: super_admin > admin > user
    const hierarchy = { user: 1, admin: 2, super_admin: 3 };
    
    return hierarchy[userLevel] >= hierarchy[requiredLevel];
  }

  // Track authentication attempts for rate limiting
  static async trackAuthAttempt(email: string, attemptType: string, success: boolean): Promise<void> {
    try {
      await supabase
        .from('auth_attempts')
        .insert({
          ip_address: '0.0.0.0', // Will be replaced with actual IP in production
          email,
          attempt_type: attemptType,
          success,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.warn('Failed to track auth attempt:', error);
    }
  }

  // Check for rate limiting
  static async checkRateLimit(email: string): Promise<boolean> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('auth_attempts')
        .select('id')
        .eq('email', email)
        .eq('success', false)
        .gte('created_at', fiveMinutesAgo);

      if (error) throw error;
      
      // Allow max 5 failed attempts in 5 minutes
      return (data?.length || 0) < 5;
    } catch {
      return true; // Allow on error to avoid blocking legitimate users
    }
  }
}
