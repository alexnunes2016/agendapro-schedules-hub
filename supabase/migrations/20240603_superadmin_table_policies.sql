-- Enable RLS on all tables
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.schedules ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "Superadmins can do anything with appointments" ON public.appointments
    FOR ALL
    TO authenticated
    USING (public.is_superadmin(auth.uid()))
    WITH CHECK (public.is_superadmin(auth.uid()));

-- Services policies
CREATE POLICY "Superadmins can do anything with services" ON public.services
    FOR ALL
    TO authenticated
    USING (public.is_superadmin(auth.uid()))
    WITH CHECK (public.is_superadmin(auth.uid()));

-- Schedules policies
CREATE POLICY "Superadmins can do anything with schedules" ON public.schedules
    FOR ALL
    TO authenticated
    USING (public.is_superadmin(auth.uid()))
    WITH CHECK (public.is_superadmin(auth.uid()));

-- Grant table permissions
GRANT ALL ON public.appointments TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.schedules TO authenticated;

-- Create helper function for admin dashboard
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM public.profiles
    WHERE user_id = auth.uid();
    
    RETURN user_role_val;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated; 