
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  is_active: boolean;
  email_confirmed: boolean;
  created_at: string;
  updated_at: string;
  plan_expires_at?: string;
  clinic_name?: string;
  service_type?: string;
  organization_id?: string;
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    by_role: Record<UserRole, number>;
  };
  organizations: {
    total: number;
    active: number;
  };
  appointments: {
    total: number;
    by_status: Record<string, number>;
  };
  revenue: {
    total: number;
    by_plan: Record<UserPlan, number>;
  };
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export type UserRole = 'superadmin' | 'admin' | 'staff' | 'client';
export type UserPlan = 'free' | 'basico' | 'profissional' | 'premium';

export interface UserFilters {
  search: string;
  role: UserRole | 'all';
  plan: UserPlan | 'all';
  status: 'active' | 'inactive' | 'all';
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: 'general' | 'email' | 'whatsapp' | 'appearance';
  created_at: string;
  updated_at: string;
}
