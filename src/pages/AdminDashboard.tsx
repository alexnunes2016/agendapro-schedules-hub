import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, DollarSign, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import UserManagementTable from "@/components/admin/UserManagementTable";
import AddClientModal from "@/components/admin/AddClientModal";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminCheck();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdminCheck();
  const navigate = useNavigate();
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!loading && !isAdmin) {
      navigate("/dashboard");
      return;
    }
  }, [user, isAdmin, loading, navigate]);

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

  if (loading || superAdminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <Link to="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-red-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
              </div>
            </div>
            
            {/* Botão de adicionar cliente apenas para super admin */}
            {isSuperAdmin && (
              <AddClientModal />
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {adminStats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +{adminStats.newUsersThisMonth} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Assinaturas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {adminStats.activeSubscriptions.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {adminStats.totalUsers > 0 ? ((adminStats.activeSubscriptions / adminStats.totalUsers) * 100).toFixed(1) : 0}% conversão
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Receita Mensal Est.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                R$ {(adminStats.monthlyRevenue / 1000).toFixed(1)}k
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estimativa baseada nos planos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Novos Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {adminStats.newUsersThisMonth}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagementTable />
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Relatórios em Desenvolvimento</p>
                  <p className="text-sm">
                    Os relatórios detalhados de upgrades e analytics estarão disponíveis em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
