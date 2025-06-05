
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  BarChart3,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { useTenantAuth } from "@/hooks/useTenantAuth";
import { SuperAdminStats } from "@/types/saas";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const SuperAdminDashboard = () => {
  const { isSuperAdmin, loading: authLoading } = useTenantAuth();
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && isSuperAdmin) {
      fetchSuperAdminStats();
    }
  }, [isSuperAdmin, authLoading]);

  const fetchSuperAdminStats = async () => {
    try {
      console.log('Fetching super admin statistics...');
      
      const { data, error } = await supabase.rpc('get_system_statistics');
      
      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }
      
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching super admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando painel de administração..." />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Acesso Negado</span>
            </CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o painel de super administrador.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Painel Super Admin
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visão geral do sistema AgendoPro SaaS
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Empresas
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_tenants || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.active_tenants || 0} ativas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.active_users || 0} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agendamentos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_appointments || 0}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(stats?.monthly_revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimativa baseada nos planos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Metrics */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Crescimento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Novas empresas:</span>
                  <Badge variant="secondary">
                    {stats?.growth_metrics?.new_tenants_this_month || 0}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Novos usuários:</span>
                  <Badge variant="secondary">
                    {stats?.growth_metrics?.new_users_this_month || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Distribuição de Planos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.plan_distribution && Object.entries(stats.plan_distribution).map(([plan, count]) => (
                  <div key={plan} className="flex justify-between">
                    <span className="text-sm text-gray-600 capitalize">{plan}:</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-purple-600" />
                <span>Ações Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Criar Nova Empresa
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Gerenciar Usuários
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Relatórios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma atividade recente encontrada</p>
              <p className="text-sm">As atividades aparecerão aqui quando houver dados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
