-- Drop all existing versions of the function
DROP FUNCTION IF EXISTS public.get_system_statistics(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS public.get_system_statistics(date, date);
DROP FUNCTION IF EXISTS public.get_system_statistics(timestamp with time zone, timestamp with time zone);

-- Create the function with proper error handling and security
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
    current_month := date_trunc('month', CURRENT_DATE);

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
    FROM profiles p
    WHERE (start_date IS NULL OR p.created_at >= start_date)
        AND (end_date IS NULL OR p.created_at <= end_date);

    -- Get plan distribution
    SELECT jsonb_object_agg(plan, count)
    INTO plan_dist
    FROM (
        SELECT 
            COALESCE(plan, 'free') as plan,
            COUNT(*) as count
        FROM profiles p
        WHERE (start_date IS NULL OR p.created_at >= start_date)
            AND (end_date IS NULL OR p.created_at <= end_date)
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
    FROM profiles p
    WHERE p.is_active = true
        AND (start_date IS NULL OR p.created_at >= start_date)
        AND (end_date IS NULL OR p.created_at <= end_date);

    -- Get appointment statistics with proper error handling
    BEGIN
        SELECT 
            COUNT(*),
            COUNT(*) FILTER (WHERE date_trunc('month', a.start_time) = current_month)
        INTO
            total_appointments,
            monthly_appointments
        FROM appointments a
        WHERE (start_date IS NULL OR a.start_time >= start_date)
            AND (end_date IS NULL OR a.start_time <= end_date);
    EXCEPTION WHEN OTHERS THEN
        -- Log error and return zero counts
        RAISE WARNING 'Error getting appointment statistics: %', SQLERRM;
        total_appointments := 0;
        monthly_appointments := 0;
    END;

    -- Build result JSON with proper null handling
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
EXCEPTION WHEN OTHERS THEN
    -- Return error information in the result
    RETURN jsonb_build_object(
        'error', SQLERRM,
        'detail', 'An error occurred while generating system statistics'
    );
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) FROM authenticated;
REVOKE ALL ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) FROM anon;

-- Grant execute permission only to authenticated users
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) TO authenticated;

-- Add function description
COMMENT ON FUNCTION public.get_system_statistics(timestamptz, timestamptz) IS 'Returns system statistics including user counts, revenue estimates, and appointment metrics for the specified date range.'; 