-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for user roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'staff', 'client');
    END IF;
END$$;

-- Create or update the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE 
            WHEN NEW.email = 'suporte@judahtech.com.br' THEN 'superadmin'::user_role
            ELSE 'client'::user_role
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create system statistics function
CREATE OR REPLACE FUNCTION public.get_system_statistics(
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    WITH stats AS (
        SELECT
            jsonb_build_object(
                'users', jsonb_build_object(
                    'total', (SELECT COUNT(*) FROM auth.users),
                    'active', (SELECT COUNT(*) FROM public.profiles WHERE is_active = true),
                    'superadmins', (SELECT COUNT(*) FROM public.profiles WHERE role = 'superadmin'),
                    'admins', (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin'),
                    'staff', (SELECT COUNT(*) FROM public.profiles WHERE role = 'staff'),
                    'clients', (SELECT COUNT(*) FROM public.profiles WHERE role = 'client'),
                    'new_users', (SELECT COUNT(*) FROM auth.users WHERE created_at BETWEEN start_date AND end_date)
                ),
                'appointments', jsonb_build_object(
                    'total', (SELECT COUNT(*) FROM public.appointments),
                    'period', (SELECT COUNT(*) FROM public.appointments WHERE created_at BETWEEN start_date AND end_date),
                    'completed', (SELECT COUNT(*) FROM public.appointments WHERE status = 'completed'),
                    'cancelled', (SELECT COUNT(*) FROM public.appointments WHERE status = 'cancelled')
                ),
                'services', jsonb_build_object(
                    'total', (SELECT COUNT(*) FROM public.services),
                    'active', (SELECT COUNT(*) FROM public.services WHERE is_active = true)
                )
            ) as metrics
    )
    SELECT metrics INTO result FROM stats;
    
    RETURN result;
END;
$$;

-- Create function to check if user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE user_id = $1
        AND role = 'superadmin'
    );
END;
$$;

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Superadmins can do anything" ON public.profiles
    FOR ALL
    TO authenticated
    USING (is_superadmin(auth.uid()))
    WITH CHECK (is_superadmin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_superadmin TO authenticated;

-- Insert or update superadmin user if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'suporte@judahtech.com.br'
    ) THEN
        INSERT INTO auth.users (
            email,
            raw_user_meta_data,
            created_at
        )
        VALUES (
            'suporte@judahtech.com.br',
            '{"role": "superadmin", "full_name": "Super Administrator"}'::jsonb,
            NOW()
        );
    END IF;
END
$$; 