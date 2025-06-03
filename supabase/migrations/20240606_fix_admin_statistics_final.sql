-- Drop existing function
DROP FUNCTION IF EXISTS public.get_admin_statistics(timestamptz, timestamptz);

-- Create enhanced admin statistics function
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

    -- Use a single CTE for all statistics
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
                    FROM profiles p2
                    WHERE organization_id IS NOT NULL
                ),
                'appointments', (
                    SELECT jsonb_build_object(
                        'total', COUNT(*),
                        'by_status', jsonb_object_agg(
                            status,
                            COUNT(*)
                        ),
                        'by_month', (
                            SELECT jsonb_object_agg(
                                to_char(date_trunc('month', a2.start_time), 'YYYY-MM'),
                                COUNT(*)
                            )
                            FROM appointments a2
                            WHERE (start_date IS NULL OR a2.start_time >= start_date)
                            AND (end_date IS NULL OR a2.start_time <= end_date)
                            GROUP BY date_trunc('month', a2.start_time)
                        )
                    )
                    FROM appointments a
                    WHERE (start_date IS NULL OR a.start_time >= start_date)
                    AND (end_date IS NULL OR a.start_time <= end_date)
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
                    FROM profiles p3
                    WHERE is_active = true
                )
            ) as metrics
        FROM profiles p
        GROUP BY true
    )
    SELECT metrics INTO result FROM stats;

    RETURN COALESCE(result, '{}'::jsonb);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'error', SQLERRM,
        'detail', 'An error occurred while generating admin statistics',
        'hint', 'Please check the database logs for more information'
    );
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) FROM PUBLIC;

-- Grant execute permission only to authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) TO authenticated;

-- Add function description
COMMENT ON FUNCTION public.get_admin_statistics(timestamptz, timestamptz) IS 'Returns detailed system statistics for superadmins, including user counts, revenue estimates, and appointment metrics.'; 