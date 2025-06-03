
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export class PermissionManager {
  private static authAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  
  static isSuperAdminSync(profile: UserProfile | null): boolean {
    if (!profile) {
      console.log('PermissionManager: No profile provided');
      return false;
    }
    
    const isSuperAdmin = profile.email === 'suporte@judahtech.com.br' && profile.role === 'admin';
    console.log('PermissionManager.isSuperAdminSync:', { 
      email: profile.email, 
      role: profile.role, 
      isSuperAdmin 
    });
    
    return isSuperAdmin;
  }

  static isAdminSync(profile: UserProfile | null): boolean {
    if (!profile) {
      console.log('PermissionManager: No profile provided for admin check');
      return false;
    }
    
    const isAdmin = profile.role === 'admin';
    console.log('PermissionManager.isAdminSync:', { 
      email: profile.email, 
      role: profile.role, 
      isAdmin 
    });
    
    return isAdmin;
  }

  static async checkRateLimit(email: string): Promise<boolean> {
    const now = Date.now();
    const attempts = this.authAttempts.get(email);
    
    if (!attempts) return true;
    
    // Reset after 15 minutes
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
      this.authAttempts.delete(email);
      return true;
    }
    
    return attempts.count < 5;
  }

  static async trackAuthAttempt(email: string, type: 'login' | 'signup', success: boolean): Promise<void> {
    if (success) {
      this.authAttempts.delete(email);
      return;
    }
    
    const now = Date.now();
    const attempts = this.authAttempts.get(email) || { count: 0, lastAttempt: 0 };
    
    this.authAttempts.set(email, {
      count: attempts.count + 1,
      lastAttempt: now
    });
  }

  static async hasPermission(permission: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_permission', { permission });
      return !error && data === true;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  static async getUserPermissions(): Promise<{ role: string; permissions: string[] }> {
    try {
      const { data, error } = await supabase.rpc('get_user_permissions');
      if (error) throw error;
      return data || { role: 'client', permissions: [] };
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return { role: 'client', permissions: [] };
    }
  }
}
