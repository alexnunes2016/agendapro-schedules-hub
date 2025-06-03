import { supabase } from './supabaseService';

export async function getAdminStatistics() {
  const { data, error } = await supabase
    .rpc('get_admin_statistics');
  if (error) throw error;
  return data;
} 