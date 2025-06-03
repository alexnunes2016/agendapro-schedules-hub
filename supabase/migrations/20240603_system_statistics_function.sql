-- Create or replace the system statistics function
CREATE OR REPLACE FUNCTION public.get_system_statistics(
    start_date timestamp with time zone,
    end_date timestamp with time zone
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH stats AS (
        SELECT
            -- User statistics
            (SELECT COUNT(*) FROM auth.users) as total_users,
            (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at >= start_date) as active_users,
            (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at < start_date OR last_sign_in_at IS NULL) as inactive_users,
            (SELECT COUNT(*) FROM auth.users WHERE created_at BETWEEN start_date AND end_date) as new_users_this_month,
            
            -- Appointment statistics
            (SELECT COUNT(*) FROM public.appointments) as total_appointments,
            (SELECT COUNT(*) FROM public.appointments WHERE created_at BETWEEN start_date AND end_date) as appointments_this_month,
            
            -- Service statistics
            (SELECT COUNT(*) FROM public.services) as total_services,
            (SELECT COUNT(*) FROM public.services WHERE created_at BETWEEN start_date AND end_date) as new_services_this_month,
            
            -- Schedule statistics
            (SELECT COUNT(*) FROM public.schedules WHERE start_time BETWEEN start_date AND end_date) as total_schedules_period,
            
            -- Calculate completion rate
            (SELECT 
                ROUND(
                    CAST(COUNT(CASE WHEN status = 'completed' THEN 1 END) AS numeric) / 
                    NULLIF(COUNT(*), 0) * 100, 
                    2
                )
            FROM public.appointments 
            WHERE created_at BETWEEN start_date AND end_date) as completion_rate,
            
            -- Calculate cancellation rate
            (SELECT 
                ROUND(
                    CAST(COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS numeric) / 
                    NULLIF(COUNT(*), 0) * 100, 
                    2
                )
            FROM public.appointments 
            WHERE created_at BETWEEN start_date AND end_date) as cancellation_rate,
            
            -- Most popular services
            (SELECT json_agg(row_to_json(popular_services))
            FROM (
                SELECT s.name, COUNT(*) as booking_count
                FROM public.appointments a
                JOIN public.schedules sch ON a.schedule_id = sch.id
                JOIN public.services s ON sch.service_id = s.id
                WHERE a.created_at BETWEEN start_date AND end_date
                GROUP BY s.name
                ORDER BY booking_count DESC
                LIMIT 5
            ) popular_services) as popular_services,
            
            -- Peak booking hours
            (SELECT json_agg(row_to_json(peak_hours))
            FROM (
                SELECT 
                    EXTRACT(HOUR FROM sch.start_time) as hour,
                    COUNT(*) as booking_count
                FROM public.appointments a
                JOIN public.schedules sch ON a.schedule_id = sch.id
                WHERE a.created_at BETWEEN start_date AND end_date
                GROUP BY hour
                ORDER BY booking_count DESC
                LIMIT 5
            ) peak_hours) as peak_booking_hours
    )
    SELECT row_to_json(stats.*) INTO result FROM stats;
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamp with time zone, timestamp with time zone) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamp with time zone, timestamp with time zone) TO service_role;

-- Add comment to the function
COMMENT ON FUNCTION public.get_system_statistics IS 'Returns system statistics for the specified date range including user counts, appointment metrics, and popular services'; 