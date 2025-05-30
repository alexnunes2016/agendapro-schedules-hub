
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, DollarSign, Calendar, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("agendopro_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userData);
    
    // Verificar se é admin (simulação)
    if (user.email !== "admin@agendopro.com") {
      navigate("/dashboard");
      return;
    }
    
    setUser(user);
  }, [navigate]);

  // Dados simulados do admin
  const adminStats = {
    totalUsers: 1250,
    activeSubscriptions: 890,
    monthlyRevenue: 125000,
    newUsersThisMonth: 78
  };

  const recentUsers = [
    {
      id: 1,
      name: "Dr. Carlos Silva",
      email: "carlos@clinica.com",
      plan: "profissional",
      joinDate: "2024-01-10",
      status: "active"
    },
    {
      id: 2,
      name: "Maria Barbeira",
      email: "maria@barbearia.com",
      plan: "basico",
      joinDate: "2024-01-08",
      status: "active"
    },
    {
      id: 3,
      name: "Ana Dentista",
      email: "ana@odonto.com",
      plan: "free",
      joinDate: "2024-01-05",
      status: "trial"
    }
  ];

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
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
                {((adminStats.activeSubscriptions / adminStats.totalUsers) * 100).toFixed(1)}% conversão
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                R$ {(adminStats.monthlyRevenue / 1000).toFixed(0)}k
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +15% vs mês anterior
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

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Usuários Recentes</CardTitle>
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium capitalize">{user.plan}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Trial'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
