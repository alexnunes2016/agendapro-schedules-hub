
// Sistema de permissões simplificado para MVP
export class PermissionManager {
  static isSuperAdminSync(profile: any): boolean {
    if (!profile) return false;
    return profile.email === 'suporte@judahtech.com.br' && profile.role === 'admin';
  }

  static isAdminSync(profile: any): boolean {
    if (!profile) return false;
    return profile.role === 'admin' || this.isSuperAdminSync(profile);
  }

  static canViewAllAppointments(profile: any): boolean {
    return this.isAdminSync(profile);
  }

  static canManageUsers(profile: any): boolean {
    return this.isAdminSync(profile);
  }

  static canAccessReports(profile: any): boolean {
    return this.isAdminSync(profile);
  }

  static canManageCalendars(profile: any): boolean {
    return this.isAdminSync(profile);
  }

  static canAccessMedicalRecords(profile: any): boolean {
    if (!profile) return false;
    return profile.service_type === 'medicina' || profile.service_type === 'odontologia';
  }
}
