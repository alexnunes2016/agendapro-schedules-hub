
-- Adicionar políticas RLS para todas as tabelas do sistema

-- Políticas para appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own appointments" ON public.appointments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own appointments" ON public.appointments
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own appointments" ON public.appointments
FOR DELETE USING (user_id = auth.uid());

-- Políticas para calendars
CREATE POLICY "Users can view their own calendars" ON public.calendars
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own calendars" ON public.calendars
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own calendars" ON public.calendars
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own calendars" ON public.calendars
FOR DELETE USING (user_id = auth.uid());

-- Políticas para services
CREATE POLICY "Users can view their own services" ON public.services
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own services" ON public.services
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own services" ON public.services
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own services" ON public.services
FOR DELETE USING (user_id = auth.uid());

-- Políticas para medical_records
CREATE POLICY "Users can view their own medical records" ON public.medical_records
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own medical records" ON public.medical_records
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own medical records" ON public.medical_records
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own medical records" ON public.medical_records
FOR DELETE USING (user_id = auth.uid());

-- Políticas para medical_record_files
CREATE POLICY "Users can view their medical record files" ON public.medical_record_files
FOR SELECT USING (
  uploaded_by = auth.uid() OR 
  medical_record_id IN (
    SELECT id FROM public.medical_records WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload medical record files" ON public.medical_record_files
FOR INSERT WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their medical record files" ON public.medical_record_files
FOR DELETE USING (
  uploaded_by = auth.uid() OR 
  medical_record_id IN (
    SELECT id FROM public.medical_records WHERE user_id = auth.uid()
  )
);

-- Políticas para profiles (usuários podem ver e editar apenas seu próprio perfil)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (id = auth.uid());

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_current_user_admin());

-- Super admins podem atualizar qualquer perfil
CREATE POLICY "Super admins can update profiles" ON public.profiles
FOR UPDATE USING (public.is_current_user_super_admin());

-- Políticas para user_settings
CREATE POLICY "Users can manage their own settings" ON public.user_settings
FOR ALL USING (user_id = auth.uid());

-- Políticas para user_roles (apenas super admins podem gerenciar)
CREATE POLICY "Super admins can manage user roles" ON public.user_roles
FOR ALL USING (public.is_current_user_super_admin());

-- Usuários podem ver suas próprias roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

-- Políticas para organization_users
CREATE POLICY "Users can view organization users" ON public.organization_users
FOR SELECT USING (
  user_id = auth.uid() OR 
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Políticas para organization_calendars
CREATE POLICY "Organization members can view calendars" ON public.organization_calendars
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Políticas para user_invitations (apenas admins)
CREATE POLICY "Admins can manage invitations" ON public.user_invitations
FOR ALL USING (public.is_current_user_admin());

-- Políticas para system_settings (apenas super admins)
CREATE POLICY "Super admins can manage system settings" ON public.system_settings
FOR ALL USING (public.is_current_user_super_admin());

-- Políticas para audit_logs (apenas admins podem ver)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT USING (public.is_current_user_admin());
