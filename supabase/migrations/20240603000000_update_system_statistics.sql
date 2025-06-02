-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.get_system_statistics();

-- Create new function
CREATE OR REPLACE FUNCTION public.get_system_statistics()
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

    WITH user_stats AS (
        SELECT
            COUNT(*) as total_users,
            COUNT(*) FILTER (WHERE is_active = true) as active_users,
            COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
            COUNT(*) FILTER (WHERE date_trunc('month', created_at) = current_month) as new_users_this_month,
            jsonb_object_agg(
                COALESCE(plan, 'free'),
                COUNT(*)
            ) as plan_distribution
        FROM profiles
    ),
    revenue_stats AS (
        SELECT
            SUM(CASE
                WHEN plan = 'basico' THEN 49.90
                WHEN plan = 'profissional' THEN 129.90
                WHEN plan = 'premium' THEN 299.90
                ELSE 0
            END) as total_revenue_estimate
        FROM profiles
        WHERE is_active = true
    )
    SELECT
        jsonb_build_object(
            'total_users', us.total_users,
            'active_users', us.active_users,
            'inactive_users', us.inactive_users,
            'new_users_this_month', us.new_users_this_month,
            'total_revenue_estimate', rs.total_revenue_estimate,
            'plan_distribution', us.plan_distribution
        ) INTO result
    FROM user_stats us
    CROSS JOIN revenue_stats rs;

    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_system_statistics() TO authenticated; 