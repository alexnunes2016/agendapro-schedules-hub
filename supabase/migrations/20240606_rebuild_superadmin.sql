-- Drop existing functions and types
DROP FUNCTION IF EXISTS public.is_superadmin(uuid);
DROP FUNCTION IF EXISTS public.is_current_user_super_admin();
DROP FUNCTION IF EXISTS public.get_user_role();
DROP TYPE IF EXISTS user_role CASCADE;

-- Create enhanced user role type
CREATE TYPE user_role AS ENUM (
    'superadmin',    -- Acesso total ao sistema
    'admin',         -- Acesso administrativo a uma organização
    'staff',         -- Funcionário com acesso limitado
    'client'         -- Cliente final
);

-- Create role permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    permission text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(role, permission)
);

-- Create default permissions
INSERT INTO public.role_permissions (role, permission) VALUES
    -- Superadmin permissions
    ('superadmin', 'system.access'),
    ('superadmin', 'system.manage'),
    ('superadmin', 'users.manage'),
    ('superadmin', 'organizations.manage'),
    ('superadmin', 'statistics.view'),
    ('superadmin', 'settings.manage'),
    -- Admin permissions
    ('admin', 'organization.access'),
    ('admin', 'organization.manage'),
    ('admin', 'users.view'),
    ('admin', 'appointments.manage'),
    ('admin', 'services.manage'),
    ('admin', 'statistics.view.organization'),
    -- Staff permissions
    ('staff', 'appointments.view'),
    ('staff', 'appointments.create'),
    ('staff', 'services.view'),
    ('staff', 'clients.view'),
    -- Client permissions
    ('client', 'appointments.view.own'),
    ('client', 'appointments.create.own'),
    ('client', 'profile.manage.own')
ON CONFLICT (role, permission) DO NOTHING;

-- Create function to check if user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM profiles p
        WHERE p.id = user_id 
        AND p.role = 'superadmin'::user_role
        AND p.is_active = true
    );
END;
$$;

-- Create function to check if current user is superadmin
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN public.is_superadmin(auth.uid());
END;
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM profiles
    WHERE id = auth.uid();
    
    RETURN COALESCE(user_role_val, 'client'::user_role);
END;
$$;

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(permission text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_val user_role;
BEGIN
    -- Get user's role
    SELECT role INTO user_role_val
    FROM profiles
    WHERE id = auth.uid()
    AND is_active = true;

    -- Check if user has the permission
    RETURN EXISTS (
        SELECT 1
        FROM role_permissions
        WHERE role = user_role_val
        AND permission = has_permission.permission
    );
END;
$$;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_val user_role;
    permissions jsonb;
BEGIN
    -- Get user's role
    SELECT role INTO user_role_val
    FROM profiles
    WHERE id = auth.uid()
    AND is_active = true;

    -- Get all permissions for the user's role
    SELECT jsonb_agg(permission)
    INTO permissions
    FROM role_permissions
    WHERE role = user_role_val;

    RETURN jsonb_build_object(
        'role', user_role_val,
        'permissions', COALESCE(permissions, '[]'::jsonb)
    );
END;
$$;

-- Create enhanced system statistics function for superadmins
CREATE OR REPLACE FUNCTION public.get_admin_statistics(
    start_date timestamptz DEFAULT NULL,
    end_date timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Check if user is superadmin
    IF NOT public.is_current_user_super_admin() THEN
        RETURN jsonb_build_object(
            'error', 'Permission denied',
            'detail', 'Only superadmins can access this function'
        );
    END IF;

    WITH stats AS (
        SELECT
            jsonb_build_object(
                'users', jsonb_build_object(
                    'total', COUNT(*),
                    'active', COUNT(*) FILTER (WHERE is_active),
                    'by_role', jsonb_object_agg(
                        role::text,
                        COUNT(*)
                    )
                ),
                'organizations', (
                    SELECT jsonb_build_object(
                        'total', COUNT(DISTINCT organization_id),
                        'active', COUNT(DISTINCT organization_id) FILTER (WHERE is_active)
                    )
                    FROM profiles
                    WHERE organization_id IS NOT NULL
                ),
                'appointments', (
                    SELECT jsonb_build_object(
                        'total', COUNT(*),
                        'by_status', jsonb_object_agg(
                            status,
                            COUNT(*)
                        )
                    )
                    FROM appointments
                    WHERE (start_date IS NULL OR start_time >= start_date)
                    AND (end_date IS NULL OR start_time <= end_date)
                ),
                'revenue', (
                    SELECT jsonb_build_object(
                        'total', SUM(CASE
                            WHEN plan = 'basico' THEN 49.90
                            WHEN plan = 'profissional' THEN 129.90
                            WHEN plan = 'premium' THEN 299.90
                            ELSE 0
                        END),
                        'by_plan', jsonb_object_agg(
                            COALESCE(plan, 'free'),
                            COUNT(*)
                        )
                    )
                    FROM profiles
                    WHERE is_active = true
                )
            ) as metrics
        FROM profiles
        GROUP BY true
    )
    SELECT metrics INTO result FROM stats;

    RETURN COALESCE(result, '{}'::jsonb);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'error', SQLERRM,
        'detail', 'An error occurred while generating admin statistics'
    );
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION public.is_superadmin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_current_user_super_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_permission(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_user_permissions() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) FROM PUBLIC;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_superadmin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) TO authenticated;

-- Enable RLS on role_permissions table
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for role_permissions
CREATE POLICY "Superadmins can manage role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (public.is_current_user_super_admin())
WITH CHECK (public.is_current_user_super_admin());

CREATE POLICY "Users can view role permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

-- Add comments
COMMENT ON TABLE public.role_permissions IS 'Stores permissions associated with each user role';
COMMENT ON FUNCTION public.is_superadmin(uuid) IS 'Checks if a user has superadmin role';
COMMENT ON FUNCTION public.is_current_user_super_admin() IS 'Checks if the current user has superadmin role';
COMMENT ON FUNCTION public.get_user_role() IS 'Returns the role of the current user';
COMMENT ON FUNCTION public.has_permission(text) IS 'Checks if the current user has a specific permission';
COMMENT ON FUNCTION public.get_user_permissions() IS 'Returns all permissions for the current user';
COMMENT ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) IS 'Returns detailed system statistics for superadmins'; 