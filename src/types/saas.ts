
// Comprehensive SaaS type definitions for multi-tenant scheduling platform
import { User } from '@supabase/supabase-js';

export type TenantRole = 'super_admin' | 'tenant_admin' | 'professional' | 'client';
export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  subscription_expires_at?: string;
  settings: TenantSettings;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    company_name?: string;
  };
  features: {
    online_booking: boolean;
    whatsapp_notifications: boolean;
    email_notifications: boolean;
    medical_records: boolean;
    reports: boolean;
    api_access: boolean;
  };
  limits: {
    max_professionals: number;
    max_clients: number;
    max_appointments_per_month: number;
    storage_limit_mb: number;
  };
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantRole;
  permissions: string[];
  is_active: boolean;
  invited_by?: string;
  invited_at?: string;
  joined_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

export interface SuperAdminStats {
  total_tenants: number;
  active_tenants: number;
  total_users: number;
  active_users: number;
  total_appointments: number;
  monthly_revenue: number;
  plan_distribution: Record<SubscriptionPlan, number>;
  growth_metrics: {
    new_tenants_this_month: number;
    new_users_this_month: number;
    churn_rate: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface AuditLog {
  id: string;
  tenant_id?: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
