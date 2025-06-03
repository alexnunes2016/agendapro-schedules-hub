
import { supabase } from '@/integrations/supabase/client';
import type { User, UserPlan, UserRole, SystemSetting } from '@/types/admin';

export class AdminService {
  // User Management
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateUserPlan(userId: string, plan: UserPlan): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        plan,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  }

  static async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  }

  static async toggleUserStatus(userId: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  }

  static async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  }

  // Statistics
  static async getAdminStatistics() {
    const { data, error } = await supabase
      .rpc('get_admin_statistics');

    if (error) throw error;
    return data;
  }

  // Settings Management
  static async getSystemSettings(category?: string): Promise<SystemSetting[]> {
    let query = supabase
      .from('system_settings')
      .select('*')
      .order('key');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async updateSystemSetting(
    key: string, 
    value: any, 
    category: string = 'general',
    description?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value,
        category,
        description,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (error) throw error;
  }

  static async deleteSystemSetting(key: string): Promise<void> {
    const { error } = await supabase
      .from('system_settings')
      .delete()
      .eq('key', key);

    if (error) throw error;
  }

  // Permission checks
  static async checkUserPermission(permission: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('has_permission', { permission });

    if (error) throw error;
    return data === true;
  }

  static async getCurrentUserRole(): Promise<UserRole> {
    const { data, error } = await supabase
      .rpc('get_user_role');

    if (error) throw error;
    return data || 'client';
  }

  static async isCurrentUserSuperAdmin(): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('is_current_user_super_admin');

    if (error) throw error;
    return data === true;
  }

  // Audit Logs
  static async getAuditLogs(limit: number = 100) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // User search and filtering
  static async searchUsers(
    searchTerm?: string,
    role?: UserRole,
    plan?: UserPlan,
    isActive?: boolean
  ): Promise<User[]> {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (plan && plan !== 'all') {
      query = query.eq('plan', plan);
    }

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }
}
