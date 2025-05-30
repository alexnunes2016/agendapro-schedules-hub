
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import AppointmentStatsCard from "@/components/AppointmentStatsCard";
import RevenueCard from "@/components/RevenueCard";

interface DashboardStatsCardsProps {
  profile: any;
}

const DashboardStatsCards = ({ profile }: DashboardStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <AppointmentStatsCard 
        type="today"
        title="Agendamentos Hoje"
        borderColor="border-l-blue-600"
        icon={<Calendar className="h-5 w-5 text-blue-600" />}
      />

      <AppointmentStatsCard 
        type="week"
        title="Esta Semana"
        borderColor="border-l-green-600"
        icon={<Users className="h-5 w-5 text-green-600" />}
      />

      <RevenueCard />

      <Card className="border-l-4 border-l-purple-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white capitalize">{profile.plan}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {profile.plan === 'free' ? 'Plano gratuito' : 'Plano ativo'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
