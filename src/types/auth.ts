
// Definições centralizadas de tipos para autenticação
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'basico' | 'profissional' | 'premium';
  role: 'user' | 'admin';
  is_active: boolean;
  email_confirmed: boolean;
  plan_expires_at?: string;
  organization_id?: string;
  clinic_name?: string;
  service_type?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

export interface PermissionLevel {
  level: 'user' | 'admin' | 'super_admin';
  canManageUsers: boolean;
  canDeleteUsers: boolean;
  canViewAllData: boolean;
  canManageSystem: boolean;
}
