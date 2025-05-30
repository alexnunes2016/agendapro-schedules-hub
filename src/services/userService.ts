
import { supabase } from "@/integrations/supabase/client";

export const userService = {
  async fetchUsers() {
    console.log('Fetching users...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Users fetch result:', { data, error });

    if (error) {
      console.error('Error details:', error);
      throw error;
    }
    
    return data || [];
  },

  async updateUserPlan(userId: string, newPlan: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
  },

  async toggleUserStatus(userId: string, newStatus: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_active: newStatus,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) throw error;
  },

  async resetUserPassword(userId: string) {
    const { error } = await supabase.rpc('admin_reset_user_password', {
      p_user_id: userId,
      p_new_password: 'temp123456'
    });

    if (error) throw error;
  },

  async toggleEmailConfirmation(userId: string, newStatus: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        email_confirmed: newStatus,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) throw error;
  },

  async updatePlanExpiration(userId: string, newDate: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        plan_expires_at: new Date(newDate).toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) throw error;
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  }
};
