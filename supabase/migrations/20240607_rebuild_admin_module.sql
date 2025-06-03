-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipos de papéis
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'staff', 'client');
    END IF;
END$$;

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'client',
    is_active BOOLEAN DEFAULT true,
    organization_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de papéis do usuário
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Tabela de organizações
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de membros da organização
CREATE TABLE IF NOT EXISTS public.organization_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Tabela de permissões por papel
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    permission TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role, permission)
);

-- Permissões padrão
INSERT INTO public.role_permissions (role, permission) VALUES
    ('super_admin', 'system.access'),
    ('super_admin', 'system.manage'),
    ('super_admin', 'users.manage'),
    ('super_admin', 'organizations.manage'),
    ('super_admin', 'statistics.view'),
    ('super_admin', 'settings.manage'),
    ('admin', 'organization.access'),
    ('admin', 'organization.manage'),
    ('admin', 'users.view'),
    ('admin', 'appointments.manage'),
    ('admin', 'services.manage'),
    ('admin', 'statistics.view.organization'),
    ('staff', 'appointments.view'),
    ('staff', 'appointments.create'),
    ('staff', 'services.view'),
    ('staff', 'clients.view'),
    ('client', 'appointments.view.own'),
    ('client', 'appointments.create.own'),
    ('client', 'profile.manage.own')
ON CONFLICT (role, permission) DO NOTHING;

-- Função: checar se usuário é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = is_super_admin.user_id
        AND role = 'super_admin'
    );
END;
$$;

-- Função: checar se usuário atual é super admin
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN public.is_super_admin(auth.uid());
END;
$$;

-- Função: obter papel do usuário
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM public.user_roles
    WHERE user_id = auth.uid()
    LIMIT 1;
    RETURN COALESCE(user_role_val, 'client');
END;
$$;

-- Função: checar permissão
CREATE OR REPLACE FUNCTION public.has_permission(permission TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM public.user_roles
    WHERE user_id = auth.uid()
    LIMIT 1;
    RETURN EXISTS (
        SELECT 1 FROM public.role_permissions
        WHERE role = user_role_val
        AND permission = has_permission.permission
    );
END;
$$;

-- Função: obter permissões do usuário
CREATE OR REPLACE FUNCTION public.get_user_permissions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_val user_role;
    permissions jsonb;
BEGIN
    SELECT role INTO user_role_val
    FROM public.user_roles
    WHERE user_id = auth.uid()
    LIMIT 1;
    SELECT jsonb_agg(permission) INTO permissions
    FROM public.role_permissions
    WHERE role = user_role_val;
    RETURN jsonb_build_object(
        'role', user_role_val,
        'permissions', COALESCE(permissions, '[]'::jsonb)
    );
END;
$$;

-- Políticas RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SuperAdmins podem tudo" ON public.profiles
    FOR ALL TO authenticated
    USING (public.is_current_user_super_admin())
    WITH CHECK (public.is_current_user_super_admin());
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Políticas RLS para user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SuperAdmins podem gerenciar roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (public.is_current_user_super_admin())
    WITH CHECK (public.is_current_user_super_admin());
CREATE POLICY "Usuários podem ver suas roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Políticas RLS para organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SuperAdmins podem tudo" ON public.organizations
    FOR ALL TO authenticated
    USING (public.is_current_user_super_admin())
    WITH CHECK (public.is_current_user_super_admin());

-- Políticas RLS para organization_users
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SuperAdmins podem tudo" ON public.organization_users
    FOR ALL TO authenticated
    USING (public.is_current_user_super_admin())
    WITH CHECK (public.is_current_user_super_admin());
CREATE POLICY "Usuários podem ver suas organizações" ON public.organization_users
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Políticas RLS para role_permissions
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SuperAdmins podem gerenciar permissões" ON public.role_permissions
    FOR ALL TO authenticated
    USING (public.is_current_user_super_admin())
    WITH CHECK (public.is_current_user_super_admin());
CREATE POLICY "Usuários podem ver permissões" ON public.role_permissions
    FOR SELECT TO authenticated
    USING (true);

-- Comentários
COMMENT ON TABLE public.profiles IS 'Tabela de perfis de usuários';
COMMENT ON TABLE public.user_roles IS 'Tabela de papéis dos usuários';
COMMENT ON TABLE public.organizations IS 'Tabela de organizações';
COMMENT ON TABLE public.organization_users IS 'Tabela de membros das organizações';
COMMENT ON TABLE public.role_permissions IS 'Tabela de permissões por papel';
COMMENT ON FUNCTION public.is_super_admin IS 'Verifica se o usuário é super admin';
COMMENT ON FUNCTION public.is_current_user_super_admin IS 'Verifica se o usuário atual é super admin';
COMMENT ON FUNCTION public.get_user_role IS 'Retorna o papel do usuário atual';
COMMENT ON FUNCTION public.has_permission IS 'Verifica se o usuário atual tem uma permissão';
COMMENT ON FUNCTION public.get_user_permissions IS 'Retorna todas as permissões do usuário atual'; 