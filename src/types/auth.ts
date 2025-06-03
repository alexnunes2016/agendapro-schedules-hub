import { User } from '@supabase/supabase-js';

// Definições centralizadas de tipos para autenticação
export type PlanType = 'free' | 'basico' | 'profissional' | 'premium';
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  role: UserRole;
  is_active: boolean;
  email_confirmed: boolean;
  plan_expires_at?: string | null;
  organization_id?: string | null;
  clinic_name?: string | null;
  service_type?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error | null }>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error?: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

export type PermissionLevelType = 'user' | 'admin' | 'super_admin';

export interface PermissionLevel {
  level: PermissionLevelType;
  canManageUsers: boolean;
  canDeleteUsers: boolean;
  canViewAllData: boolean;
  canManageSystem: boolean;
}
