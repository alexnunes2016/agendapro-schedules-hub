
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface AdminStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_this_month: number;
  total_revenue_estimate: number;
  plan_distribution: Record<string, number>;
  total_appointments: number;
  appointments_this_month: number;
}

export const useAdminStats = (isAdmin: boolean) => {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_system_statistics');

      if (error) throw error;

      setAdminStats(data || {
        total_users: 0,
        active_users: 0,
        inactive_users: 0,
        new_users_this_month: 0,
        total_revenue_estimate: 0,
        plan_distribution: {},
        total_appointments: 0,
        appointments_this_month: 0
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    adminStats,
    loading,
    refetch: fetchAdminStats
  };
};
