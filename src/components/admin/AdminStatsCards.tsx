
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, DollarSign, Calendar } from "lucide-react";

interface AdminStatsCardsProps {
  adminStats: {
    total_users: number;
    active_users: number;
    inactive_users: number;
    new_users_this_month: number;
    total_revenue_estimate: number;
    plan_distribution: Record<string, number>;
    total_appointments: number;
    appointments_this_month: number;
  } | null;
}

const AdminStatsCards = ({ adminStats }: AdminStatsCardsProps) => {
  if (!adminStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total de Usuários",
      value: adminStats.total_users.toLocaleString(),
      icon: Users,
      description: `${adminStats.active_users} ativos`
    },
    {
      title: "Novos Usuários (Mês)",
      value: adminStats.new_users_this_month.toLocaleString(),
      icon: UserPlus,
      description: "Este mês"
    },
    {
      title: "Receita Estimada",
      value: `R$ ${adminStats.total_revenue_estimate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: "Mensal"
    },
    {
      title: "Agendamentos",
      value: adminStats.total_appointments.toLocaleString(),
      icon: Calendar,
      description: `${adminStats.appointments_this_month} este mês`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsCards;
