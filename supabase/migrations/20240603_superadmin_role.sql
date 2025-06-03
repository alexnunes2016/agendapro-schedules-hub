-- Create superadmin role if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'superadmin') THEN
    CREATE ROLE superadmin;
  END IF;
END
$$;

-- Grant all privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO superadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO superadmin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO superadmin;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO superadmin;

-- Make sure new tables will be accessible by superadmin
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO superadmin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO superadmin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON FUNCTIONS TO superadmin;

-- Grant superadmin role to the specific user
GRANT superadmin TO auth.users WHERE email = 'suporte@judahtech.com.br';

-- Additional security policies
ALTER ROLE superadmin SET search_path = public;

-- Enable RLS but allow superadmin to bypass
ALTER ROLE superadmin SET pgrst.db_anon_role = 'anon';
ALTER ROLE superadmin SET request.jwt.claim.role = 'superadmin'; 