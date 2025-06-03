-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.get_system_statistics(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS public.get_system_statistics(date, date);

-- Create the function with both date and timestamptz support
CREATE OR REPLACE FUNCTION public.get_system_statistics(
    start_date timestamptz,
    end_date timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    current_month date;
    is_super_admin boolean;
BEGIN
    -- Check if user is super admin
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'superadmin'
    ) INTO is_super_admin;

    IF NOT is_super_admin THEN
        RETURN jsonb_build_object(
            'error', 'Permission denied',
            'message', 'Este relatório requer privilégios de super admin',
            'details', jsonb_build_object(
                'required_role', 'superadmin',
                'current_user', auth.uid()
            )
        );
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
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) TO authenticated; 