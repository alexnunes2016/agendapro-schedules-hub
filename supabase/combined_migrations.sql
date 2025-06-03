-- Combined migrations file
BEGIN;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.medical_record_files;
DROP TABLE IF EXISTS public.medical_records;
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.calendars;
DROP TABLE IF EXISTS public.organization_calendars;
DROP TABLE IF EXISTS public.organization_users;
DROP TABLE IF EXISTS public.user_invitations;
DROP TABLE IF EXISTS public.user_settings;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.system_settings;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.profiles;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    plan text DEFAULT 'free' CHECK (plan IN ('free', 'basico', 'profissional', 'premium')),
    is_active boolean DEFAULT true,
    email_confirmed boolean DEFAULT false,
    plan_expires_at timestamptz,
    organization_id uuid,
    clinic_name text,
    service_type text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Create organization_users table
CREATE TABLE public.organization_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

-- Create calendars table
CREATE TABLE public.calendars (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES public.organization_users(organization_id),
    is_active boolean DEFAULT true,
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    duration interval NOT NULL,
    price decimal(10,2),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    calendar_id uuid REFERENCES public.calendars(id) ON DELETE CASCADE,
    is_active boolean DEFAULT true,
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    calendar_id uuid REFERENCES public.calendars(id) ON DELETE CASCADE,
    service_id uuid REFERENCES public.services(id),
    client_name text NOT NULL,
    client_email text,
    client_phone text,
    status text NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create medical_records table
CREATE TABLE public.medical_records (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
    record_date date NOT NULL,
    diagnosis text,
    treatment text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create medical_record_files table
CREATE TABLE public.medical_record_files (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_id uuid REFERENCES public.medical_records(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    file_path text NOT NULL,
    uploaded_by uuid REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE public.user_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Create user_invitations table
CREATE TABLE public.user_invitations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL,
    name text NOT NULL,
    organization_id uuid NOT NULL,
    role text NOT NULL CHECK (role IN ('member', 'admin')),
    invited_by uuid REFERENCES public.profiles(id),
    status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create system_settings table
CREATE TABLE public.system_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key text NOT NULL UNIQUE,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    action text NOT NULL,
    table_name text,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    user_id uuid REFERENCES public.profiles(id),
    ip_address inet,
    user_agent text,
    timestamp timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX idx_organization_users_org ON public.organization_users(organization_id);
CREATE INDEX idx_organization_users_user ON public.organization_users(user_id);
CREATE INDEX idx_calendars_user ON public.calendars(user_id);
CREATE INDEX idx_calendars_organization ON public.calendars(organization_id);
CREATE INDEX idx_services_user ON public.services(user_id);
CREATE INDEX idx_services_calendar ON public.services(calendar_id);
CREATE INDEX idx_appointments_user ON public.appointments(user_id);
CREATE INDEX idx_appointments_calendar ON public.appointments(calendar_id);
CREATE INDEX idx_appointments_service ON public.appointments(service_id);
CREATE INDEX idx_medical_records_user ON public.medical_records(user_id);
CREATE INDEX idx_medical_records_appointment ON public.medical_records(appointment_id);
CREATE INDEX idx_medical_record_files_record ON public.medical_record_files(medical_record_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_record_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create helper functions
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('admin', 'super_admin')
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
    );
END;
$$;

-- Create trigger functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.organization_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.calendars
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.medical_records
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can create their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can update their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can delete their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can view their own services" ON public.services;
DROP POLICY IF EXISTS "Users can create their own services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their own services" ON public.services;
DROP POLICY IF EXISTS "Users can view their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can create their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can update their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can delete their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can view their medical record files" ON public.medical_record_files;
DROP POLICY IF EXISTS "Users can upload medical record files" ON public.medical_record_files;
DROP POLICY IF EXISTS "Users can delete their medical record files" ON public.medical_record_files;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Super admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view organization users" ON public.organization_users;
DROP POLICY IF EXISTS "Organization members can view calendars" ON public.organization_calendars;
DROP POLICY IF EXISTS "Admins can manage invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Super admins can manage system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

-- Create new policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Organization members can view profiles"
ON public.profiles FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM public.organization_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_current_user_admin());

CREATE POLICY "Super admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.is_current_user_super_admin());

-- Organization users policies
CREATE POLICY "Users can view organization members"
ON public.organization_users FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM public.profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Organization admins can manage members"
ON public.organization_users FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.organization_users ou 
        WHERE ou.organization_id = organization_users.organization_id 
        AND ou.user_id = auth.uid() 
        AND ou.role IN ('owner', 'admin')
    )
);

-- Calendar policies
CREATE POLICY "Users can view accessible calendars"
ON public.calendars FOR SELECT
USING (
    user_id = auth.uid() OR
    organization_id IN (
        SELECT organization_id 
        FROM public.organization_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage own calendars"
ON public.calendars FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Organization admins can manage calendars"
ON public.calendars FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.organization_users ou 
        WHERE ou.organization_id = calendars.organization_id 
        AND ou.user_id = auth.uid() 
        AND ou.role IN ('owner', 'admin')
    )
);

-- Service policies
CREATE POLICY "Users can view accessible services"
ON public.services FOR SELECT
USING (
    user_id = auth.uid() OR
    calendar_id IN (
        SELECT id 
        FROM public.calendars 
        WHERE organization_id IN (
            SELECT organization_id 
            FROM public.organization_users 
            WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can manage own services"
ON public.services FOR ALL
USING (user_id = auth.uid());

-- Appointment policies
CREATE POLICY "Users can view accessible appointments"
ON public.appointments FOR SELECT
USING (
    user_id = auth.uid() OR
    calendar_id IN (
        SELECT id 
        FROM public.calendars 
        WHERE organization_id IN (
            SELECT organization_id 
            FROM public.organization_users 
            WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can manage own appointments"
ON public.appointments FOR ALL
USING (user_id = auth.uid());

-- Medical records policies
CREATE POLICY "Users can view own medical records"
ON public.medical_records FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own medical records"
ON public.medical_records FOR ALL
USING (user_id = auth.uid());

-- Medical record files policies
CREATE POLICY "Users can view own medical record files"
ON public.medical_record_files FOR SELECT
USING (
    medical_record_id IN (
        SELECT id 
        FROM public.medical_records 
        WHERE user_id = auth.uid()
    ) OR
    uploaded_by = auth.uid()
);

CREATE POLICY "Users can manage own medical record files"
ON public.medical_record_files FOR ALL
USING (uploaded_by = auth.uid());

-- User settings policies
CREATE POLICY "Users can manage own settings"
ON public.user_settings FOR ALL
USING (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_current_user_super_admin());

-- User invitations policies
CREATE POLICY "Organization admins can manage invitations"
ON public.user_invitations FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.organization_users ou 
        WHERE ou.organization_id = user_invitations.organization_id 
        AND ou.user_id = auth.uid() 
        AND ou.role IN ('owner', 'admin')
    )
);

CREATE POLICY "Users can view invitations"
ON public.user_invitations FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM public.organization_users 
        WHERE user_id = auth.uid()
    )
);

-- System settings policies
CREATE POLICY "Super admins can manage system settings"
ON public.system_settings FOR ALL
USING (public.is_current_user_super_admin());

-- Audit logs policies
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_current_user_admin());

-- Drop existing function
DROP FUNCTION IF EXISTS public.get_system_statistics(date, date);

-- Create new function
CREATE OR REPLACE FUNCTION public.get_system_statistics(
    start_date date DEFAULT NULL,
    end_date date DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    current_month date;
BEGIN
    -- Check if user is super admin
    IF NOT public.is_current_user_super_admin() THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    -- Get current month start date
    current_month := date_trunc('month', current_date);

    WITH filtered_profiles AS (
        SELECT *
        FROM profiles
        WHERE (start_date IS NULL OR created_at >= start_date)
          AND (end_date IS NULL OR created_at <= end_date)
    ),
    user_stats AS (
        SELECT
            COUNT(*) as total_users,
            COUNT(*) FILTER (WHERE is_active = true) as active_users,
            COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
            COUNT(*) FILTER (WHERE date_trunc('month', created_at) = current_month) as new_users_this_month,
            jsonb_object_agg(
                COALESCE(plan, 'free'),
                COUNT(*)
            ) as plan_distribution
        FROM filtered_profiles
    ),
    revenue_stats AS (
        SELECT
            SUM(CASE
                WHEN plan = 'basico' THEN 49.90
                WHEN plan = 'profissional' THEN 129.90
                WHEN plan = 'premium' THEN 299.90
                ELSE 0
            END) as total_revenue_estimate
        FROM filtered_profiles
        WHERE is_active = true
    ),
    appointment_stats AS (
        SELECT
            COUNT(*) as total_appointments,
            COUNT(*) FILTER (WHERE date_trunc('month', start_time) = current_month) as appointments_this_month
        FROM appointments
        WHERE (start_date IS NULL OR start_time >= start_date)
          AND (end_date IS NULL OR start_time <= end_date)
    )
    SELECT
        jsonb_build_object(
            'total_users', us.total_users,
            'active_users', us.active_users,
            'inactive_users', us.inactive_users,
            'new_users_this_month', us.new_users_this_month,
            'total_revenue_estimate', rs.total_revenue_estimate,
            'plan_distribution', us.plan_distribution,
            'total_appointments', aps.total_appointments,
            'appointments_this_month', aps.appointments_this_month
        ) INTO result
    FROM user_stats us
    CROSS JOIN revenue_stats rs
    CROSS JOIN appointment_stats aps;

    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_system_statistics(date, date) TO authenticated;

COMMIT; 