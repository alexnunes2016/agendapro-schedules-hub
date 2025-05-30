
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
}

export const useAdminStats = (isAdmin: boolean) => {
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  const fetchAdminStats = async () => {
    try {
      // Buscar estatísticas dos usuários
      const { data: users, error: usersError } = await (supabase as any)
        .from('profiles')
        .select('plan, created_at');

      if (usersError) throw usersError;

      const totalUsers = users?.length || 0;
      const activeSubscriptions = users?.filter(u => u.plan !== 'free').length || 0;
      
      // Calcular usuários novos este mês
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newUsersThisMonth = users?.filter(u => {
        const userDate = new Date(u.created_at);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      }).length || 0;

      // Estimativa de receita mensal (valores dos planos)
      const planValues = { basico: 49.90, profissional: 129.90, premium: 299.90 };
      const monthlyRevenue = users?.reduce((total, user) => {
        return total + (planValues[user.plan as keyof typeof planValues] || 0);
      }, 0) || 0;

      setAdminStats({
        totalUsers,
        activeSubscriptions,
        monthlyRevenue,
        newUsersThisMonth
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  return { adminStats };
};
