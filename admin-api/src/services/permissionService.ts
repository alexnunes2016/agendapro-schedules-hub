import { supabase } from './supabaseService';

export async function getAllPermissions() {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permission')
    .neq('permission', null);
  if (error) throw error;
  // Retornar apenas permissões únicas
  const uniquePermissions = Array.from(new Set((data || []).map((p: any) => p.permission)));
  return uniquePermissions;
} 