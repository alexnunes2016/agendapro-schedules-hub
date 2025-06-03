-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.get_admin_statistics(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS public.get_system_statistics(timestamptz, timestamptz);

-- Create enhanced admin statistics function with proper column references
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

    -- Use a single CTE for all statistics with proper error handling
    BEGIN
        WITH user_stats AS (
            SELECT
                COUNT(*) as total_users,
                COUNT(*) FILTER (WHERE is_active) as active_users,
                jsonb_object_agg(
                    COALESCE(role::text, 'undefined'),
                    COUNT(*)
                ) as role_distribution
            FROM profiles
        ),
        org_stats AS (
            SELECT
                COUNT(DISTINCT organization_id) as total_orgs,
                COUNT(DISTINCT organization_id) FILTER (WHERE is_active) as active_orgs
            FROM profiles
            WHERE organization_id IS NOT NULL
        ),
        appointment_stats AS (
            SELECT
                COUNT(*) as total_appointments,
                jsonb_object_agg(
                    COALESCE(status, 'undefined'),
                    COUNT(*)
                ) as status_distribution,
                jsonb_object_agg(
                    to_char(date_trunc('month', created_at), 'YYYY-MM'),
                    COUNT(*)
                ) as monthly_distribution
            FROM appointments
            WHERE (start_date IS NULL OR created_at >= start_date)
            AND (end_date IS NULL OR created_at <= end_date)
            GROUP BY true
        ),
        revenue_stats AS (
            SELECT
                SUM(CASE
                    WHEN plan = 'basico' THEN 49.90
                    WHEN plan = 'profissional' THEN 129.90
                    WHEN plan = 'premium' THEN 299.90
                    ELSE 0
                END) as total_revenue,
                jsonb_object_agg(
                    COALESCE(plan, 'free'),
                    COUNT(*)
                ) as plan_distribution
            FROM profiles
            WHERE is_active = true
        )
        SELECT jsonb_build_object(
            'users', jsonb_build_object(
                'total', us.total_users,
                'active', us.active_users,
                'by_role', us.role_distribution
            ),
            'organizations', jsonb_build_object(
                'total', os.total_orgs,
                'active', os.active_orgs
            ),
            'appointments', jsonb_build_object(
                'total', COALESCE(aps.total_appointments, 0),
                'by_status', COALESCE(aps.status_distribution, '{}'::jsonb),
                'by_month', COALESCE(aps.monthly_distribution, '{}'::jsonb)
            ),
            'revenue', jsonb_build_object(
                'total', COALESCE(rs.total_revenue, 0),
                'by_plan', COALESCE(rs.plan_distribution, '{}'::jsonb)
            )
        ) INTO result
        FROM user_stats us
        CROSS JOIN org_stats os
        LEFT JOIN appointment_stats aps ON true
        LEFT JOIN revenue_stats rs ON true;

        RETURN COALESCE(result, '{}'::jsonb);
    EXCEPTION WHEN OTHERS THEN
        -- Log the error details
        RAISE WARNING 'Error in statistics calculation: %', SQLERRM;
        -- Return a structured error response
        RETURN jsonb_build_object(
            'error', SQLERRM,
            'detail', 'Error calculating statistics',
            'hint', 'Check database logs for more information'
        );
    END;
END;
$$;

-- Create system statistics function with proper column references
CREATE OR REPLACE FUNCTION public.get_system_statistics(
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
    current_month date;
BEGIN
    -- Get current month start date
    current_month := date_trunc('month', CURRENT_DATE);

    -- Use CTEs for better organization and error handling
    BEGIN
        WITH user_stats AS (
            SELECT
                COUNT(*) as total_users,
                COUNT(*) FILTER (WHERE is_active) as active_users,
                COUNT(*) FILTER (WHERE NOT is_active) as inactive_users,
                COUNT(*) FILTER (WHERE date_trunc('month', created_at) = current_month) as new_users
            FROM profiles
            WHERE (start_date IS NULL OR created_at >= start_date)
            AND (end_date IS NULL OR created_at <= end_date)
        ),
        plan_stats AS (
            SELECT
                jsonb_object_agg(
                    COALESCE(plan, 'free'),
                    COUNT(*)
                ) as distribution,
                SUM(CASE
                    WHEN plan = 'basico' THEN 49.90
                    WHEN plan = 'profissional' THEN 129.90
                    WHEN plan = 'premium' THEN 299.90
                    ELSE 0
                END) as revenue
            FROM profiles
            WHERE is_active = true
            AND (start_date IS NULL OR created_at >= start_date)
            AND (end_date IS NULL OR created_at <= end_date)
        ),
        appointment_stats AS (
            SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE date_trunc('month', created_at) = current_month) as monthly
            FROM appointments
            WHERE (start_date IS NULL OR created_at >= start_date)
            AND (end_date IS NULL OR created_at <= end_date)
        )
        SELECT jsonb_build_object(
            'total_users', us.total_users,
            'active_users', us.active_users,
            'inactive_users', us.inactive_users,
            'new_users_this_month', us.new_users,
            'total_revenue_estimate', COALESCE(ps.revenue, 0),
            'plan_distribution', COALESCE(ps.distribution, '{}'::jsonb),
            'total_appointments', COALESCE(aps.total, 0),
            'appointments_this_month', COALESCE(aps.monthly, 0)
        ) INTO result
        FROM user_stats us
        CROSS JOIN plan_stats ps
        CROSS JOIN appointment_stats aps;

        RETURN COALESCE(result, '{}'::jsonb);
    EXCEPTION WHEN OTHERS THEN
        -- Log the error details
        RAISE WARNING 'Error in statistics calculation: %', SQLERRM;
        -- Return a structured error response
        RETURN jsonb_build_object(
            'error', SQLERRM,
            'detail', 'Error calculating system statistics',
            'hint', 'Check database logs for more information'
        );
    END;
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) FROM PUBLIC;

-- Grant execute permissions only to authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) TO authenticated;

-- Add function descriptions
COMMENT ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) IS 'Returns detailed system statistics for superadmins with proper error handling and column references.';
COMMENT ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) IS 'Returns system-wide statistics with proper error handling and column references.'; 