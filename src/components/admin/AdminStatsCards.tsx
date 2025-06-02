
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 px-4 sm:px-0">
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            Total de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {adminStats.totalUsers.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +{adminStats.newUsersThisMonth} este mês
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            Assinaturas Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {adminStats.activeSubscriptions.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {adminStats.totalUsers > 0 ? ((adminStats.activeSubscriptions / adminStats.totalUsers) * 100).toFixed(1) : 0}% conversão
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            <span className="hidden sm:inline">Receita Mensal Est.</span>
            <span className="sm:hidden">Receita Est.</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            R$ {(adminStats.monthlyRevenue / 1000).toFixed(1)}k
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="hidden sm:inline">Estimativa baseada nos planos</span>
            <span className="sm:hidden">Estimativa</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            Novos Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
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
