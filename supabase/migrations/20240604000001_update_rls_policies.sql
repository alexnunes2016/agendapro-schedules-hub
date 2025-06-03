-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can create their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can update their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can delete their own calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can view their own services" ON public.services;
DROP POLICY IF EXISTS "Users can create their own services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their own services" ON public.services;
DROP POLICY IF EXISTS "Users can view their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can create their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can update their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can delete their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can view their medical record files" ON public.medical_record_files;
DROP POLICY IF EXISTS "Users can upload medical record files" ON public.medical_record_files;
DROP POLICY IF EXISTS "Users can delete their medical record files" ON public.medical_record_files;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Super admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view organization users" ON public.organization_users;
DROP POLICY IF EXISTS "Organization members can view calendars" ON public.organization_calendars;
DROP POLICY IF EXISTS "Admins can manage invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Super admins can manage system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

-- Create new policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Organization members can view profiles"
ON public.profiles FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM public.organization_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_current_user_admin());

CREATE POLICY "Super admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.is_current_user_super_admin());

-- Organization users policies
CREATE POLICY "Users can view organization members"
ON public.organization_users FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM public.profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Organization admins can manage members"
ON public.organization_users FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.organization_users ou 
        WHERE ou.organization_id = organization_users.organization_id 
        AND ou.user_id = auth.uid() 
        AND ou.role IN ('owner', 'admin')
    )
);

-- Calendar policies
CREATE POLICY "Users can view accessible calendars"
ON public.calendars FOR SELECT
USING (
    user_id = auth.uid() OR
    organization_id IN (
        SELECT organization_id 
        FROM public.organization_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage own calendars"
ON public.calendars FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Organization admins can manage calendars"
ON public.calendars FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.organization_users ou 
        WHERE ou.organization_id = calendars.organization_id 
        AND ou.user_id = auth.uid() 
        AND ou.role IN ('owner', 'admin')
    )
);

-- Service policies
CREATE POLICY "Users can view accessible services"
ON public.services FOR SELECT
USING (
    user_id = auth.uid() OR
    calendar_id IN (
        SELECT id 
        FROM public.calendars 
        WHERE organization_id IN (
            SELECT organization_id 
            FROM public.organization_users 
            WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can manage own services"
ON public.services FOR ALL
USING (user_id = auth.uid());

-- Appointment policies
CREATE POLICY "Users can view accessible appointments"
ON public.appointments FOR SELECT
USING (
    user_id = auth.uid() OR
    calendar_id IN (
        SELECT id 
        FROM public.calendars 
        WHERE organization_id IN (
            SELECT organization_id 
            FROM public.organization_users 
            WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can manage own appointments"
ON public.appointments FOR ALL
USING (user_id = auth.uid());

-- Medical records policies
CREATE POLICY "Users can view own medical records"
ON public.medical_records FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own medical records"
ON public.medical_records FOR ALL
USING (user_id = auth.uid());

-- Medical record files policies
CREATE POLICY "Users can view own medical record files"
ON public.medical_record_files FOR SELECT
USING (
    medical_record_id IN (
        SELECT id 
        FROM public.medical_records 
        WHERE user_id = auth.uid()
    ) OR
    uploaded_by = auth.uid()
);

CREATE POLICY "Users can manage own medical record files"
ON public.medical_record_files FOR ALL
USING (uploaded_by = auth.uid());

-- User settings policies
CREATE POLICY "Users can manage own settings"
ON public.user_settings FOR ALL
USING (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_current_user_super_admin());

-- User invitations policies
CREATE POLICY "Organization admins can manage invitations"
ON public.user_invitations FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.organization_users ou 
        WHERE ou.organization_id = user_invitations.organization_id 
        AND ou.user_id = auth.uid() 
        AND ou.role IN ('owner', 'admin')
    )
);

CREATE POLICY "Users can view invitations"
ON public.user_invitations FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM public.organization_users 
        WHERE user_id = auth.uid()
    )
);

-- System settings policies
CREATE POLICY "Super admins can manage system settings"
ON public.system_settings FOR ALL
USING (public.is_current_user_super_admin());

-- Audit logs policies
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_current_user_admin()); 