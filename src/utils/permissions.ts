
import { UserProfile } from '@/types/auth';

// Centralizando toda a lógica de permissões
export class PermissionManager {
  static isSuperAdmin(profile: UserProfile | null): boolean {
    if (!profile) return false;
    return profile.role === 'admin' && profile.email === 'suporte@judahtech.com.br';
  }

  static isAdmin(profile: UserProfile | null): boolean {
    if (!profile) return false;
    return profile.role === 'admin';
  }

  static canManageUsers(profile: UserProfile | null): boolean {
    return this.isAdmin(profile);
  }

  static canDeleteUsers(profile: UserProfile | null): boolean {
    return this.isSuperAdmin(profile);
  }

  static canViewAllAppointments(profile: UserProfile | null): boolean {
    return this.isAdmin(profile);
  }

  static canManageSystemSettings(profile: UserProfile | null): boolean {
    return this.isSuperAdmin(profile);
  }

  static getPermissionLevel(profile: UserProfile | null): 'user' | 'admin' | 'super_admin' {
    if (this.isSuperAdmin(profile)) return 'super_admin';
    if (this.isAdmin(profile)) return 'admin';
    return 'user';
  }

  static validateAccess(profile: UserProfile | null, requiredLevel: 'user' | 'admin' | 'super_admin'): boolean {
    if (!profile || !profile.is_active) return false;

    const userLevel = this.getPermissionLevel(profile);
    
    // Hierarquia: super_admin > admin > user
    const hierarchy = { user: 1, admin: 2, super_admin: 3 };
    
    return hierarchy[userLevel] >= hierarchy[requiredLevel];
  }
}
