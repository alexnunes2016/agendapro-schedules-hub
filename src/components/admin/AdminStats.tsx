
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/admin/useAdminStats';
import { Users, UserPlus, DollarSign, Calendar } from 'lucide-react';

export const AdminStats = () => {
  const { stats, loading } = useAdminStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <CardTitle className="text-sm">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Total de Usuários",
      value: stats.users.total.toLocaleString(),
      description: `${stats.users.active} ativos`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Organizações",
      value: stats.organizations.total.toLocaleString(),
      description: `${stats.organizations.active} ativas`,
      icon: UserPlus,
      color: "text-green-600"
    },
    {
      title: "Receita Estimada",
      value: `R$ ${stats.revenue.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: "Mensal",
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Agendamentos",
      value: stats.appointments.total.toLocaleString(),
      description: "Total no sistema",
      icon: Calendar,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
