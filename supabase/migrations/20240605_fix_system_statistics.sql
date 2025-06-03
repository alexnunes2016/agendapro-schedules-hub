-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_system_statistics(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS public.get_system_statistics(date, date);

-- Create the function with timestamptz support
CREATE OR REPLACE FUNCTION public.get_system_statistics(
    start_date timestamptz DEFAULT NULL,
    end_date timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    current_month date;
    total_users integer;
    active_users integer;
    inactive_users integer;
    new_users_this_month integer;
    total_revenue numeric;
    total_appointments integer;
    monthly_appointments integer;
    plan_dist jsonb;
BEGIN
    -- Get current month start date
    current_month := date_trunc('month', current_date);

    -- Get user statistics
    SELECT 
        COUNT(*),
        SUM(CASE WHEN is_active THEN 1 ELSE 0 END),
        SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END),
        SUM(CASE WHEN date_trunc('month', created_at) = current_month THEN 1 ELSE 0 END)
    INTO 
        total_users,
        active_users,
        inactive_users,
        new_users_this_month
    FROM profiles
    WHERE (start_date IS NULL OR created_at >= start_date)
        AND (end_date IS NULL OR created_at <= end_date);

    -- Get plan distribution
    SELECT jsonb_object_agg(plan, count)
    INTO plan_dist
    FROM (
        SELECT 
            COALESCE(plan, 'free') as plan,
            COUNT(*) as count
        FROM profiles
        WHERE (start_date IS NULL OR created_at >= start_date)
            AND (end_date IS NULL OR created_at <= end_date)
        GROUP BY plan
    ) plan_counts;

    -- Get revenue estimate
    SELECT COALESCE(SUM(
        CASE
            WHEN plan = 'basico' THEN 49.90
            WHEN plan = 'profissional' THEN 129.90
            WHEN plan = 'premium' THEN 299.90
            ELSE 0
        END
    ), 0)
    INTO total_revenue
    FROM profiles
    WHERE is_active = true
        AND (start_date IS NULL OR created_at >= start_date)
        AND (end_date IS NULL OR created_at <= end_date);

    -- Get appointment statistics
    SELECT 
        COUNT(*),
        SUM(CASE WHEN date_trunc('month', created_at) = current_month THEN 1 ELSE 0 END)
    INTO
        total_appointments,
        monthly_appointments
    FROM appointments
    WHERE (start_date IS NULL OR created_at >= start_date)
        AND (end_date IS NULL OR created_at <= end_date);

    -- Build result JSON
    result := jsonb_build_object(
        'total_users', COALESCE(total_users, 0),
        'active_users', COALESCE(active_users, 0),
        'inactive_users', COALESCE(inactive_users, 0),
        'new_users_this_month', COALESCE(new_users_this_month, 0),
        'total_revenue_estimate', COALESCE(total_revenue, 0),
        'plan_distribution', COALESCE(plan_dist, '{}'::jsonb),
        'total_appointments', COALESCE(total_appointments, 0),
        'appointments_this_month', COALESCE(monthly_appointments, 0)
    );

    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) TO authenticated; 