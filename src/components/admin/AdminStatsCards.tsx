
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminStatsCardsProps {
  adminStats: {
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    newUsersThisMonth: number;
  };
}

const AdminStatsCards = ({ adminStats }: AdminStatsCardsProps) => {
  return (
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
  );
};

export default AdminStatsCards;
