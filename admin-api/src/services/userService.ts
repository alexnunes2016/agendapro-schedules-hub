import { supabase } from './supabaseService';

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  if (error) throw error;
  return data;
} 