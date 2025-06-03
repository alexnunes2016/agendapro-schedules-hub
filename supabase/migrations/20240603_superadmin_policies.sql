-- Enable RLS on all tables
ALTER TABLE IF EXISTS public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.schedules FORCE ROW LEVEL SECURITY;

-- Create policies for superadmin access
CREATE POLICY superadmin_all_profiles ON public.profiles
    FOR ALL
    TO superadmin
    USING (true)
    WITH CHECK (true);

CREATE POLICY superadmin_all_appointments ON public.appointments
    FOR ALL
    TO superadmin
    USING (true)
    WITH CHECK (true);

CREATE POLICY superadmin_all_services ON public.services
    FOR ALL
    TO superadmin
    USING (true)
    WITH CHECK (true);

CREATE POLICY superadmin_all_schedules ON public.schedules
    FOR ALL
    TO superadmin
    USING (true)
    WITH CHECK (true);

-- Grant direct table access to superadmin
GRANT ALL ON public.profiles TO superadmin;
GRANT ALL ON public.appointments TO superadmin;
GRANT ALL ON public.services TO superadmin;
GRANT ALL ON public.schedules TO superadmin; 