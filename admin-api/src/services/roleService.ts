import { supabase } from './supabaseService';

export async function getAllRoles() {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .neq('role', null);
  if (error) throw error;
  // Retornar apenas papéis únicos
  const uniqueRoles = Array.from(new Set((data || []).map((r: any) => r.role)));
  return uniqueRoles;
} 