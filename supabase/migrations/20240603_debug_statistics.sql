-- Check if the function exists
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition,
    p.proargnames as argument_names,
    p.proargtypes as argument_types
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname LIKE '%statistics%';

-- List all functions in public schema
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- Drop existing function if any (to clean up)
DROP FUNCTION IF EXISTS public.get_system_statistics(timestamp with time zone, timestamp with time zone);

-- Create the function with a simpler version first to test
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
            -- Basic counts only for testing
            (SELECT COUNT(*) FROM auth.users) as total_users,
            (SELECT COUNT(*) FROM public.appointments) as total_appointments,
            (SELECT COUNT(*) FROM public.services) as total_services,
            (SELECT COUNT(*) FROM public.schedules) as total_schedules
    )
    SELECT row_to_json(stats.*) INTO result FROM stats;
    
    RETURN result;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamp with time zone, timestamp with time zone) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamp with time zone, timestamp with time zone) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_system_statistics(timestamp with time zone, timestamp with time zone) TO anon;

-- Test the function
SELECT public.get_system_statistics(
    NOW() - interval '30 days',
    NOW()
); 