import { supabase } from './supabaseService';

export async function getAllOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*');
  if (error) throw error;
  return data;
} 