
import { Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, FileText } from "lucide-react";

interface DashboardQuickActionsProps {
  profile: any;
}

const DashboardQuickActions = ({ profile }: DashboardQuickActionsProps) => {
  const canAccessMedicalRecords = () => {
    return (profile?.service_type === 'medicina' || profile?.service_type === 'odontologia') &&
           ['basico', 'profissional', 'premium'].includes(profile?.plan || '');
  };

  const actions = [
    {
      to: "/appointments",
      icon: Calendar,
      title: "Agendamentos",
      description: "Visualizar e gerenciar agendamentos",
      color: "text-blue-600"
    },
    {
      to: "/clients",
      icon: Users,
      title: "Clientes",
      description: "Lista de clientes e histórico",
      color: "text-green-600"
    },
    {
      to: "/services",
      icon: Clock,
      title: "Serviços",
      description: "Configurar serviços e horários",
      color: "text-purple-600"
    }
  ];

  if (canAccessMedicalRecords()) {
    actions.push({
      to: "/medical-records",
      icon: FileText,
      title: "Prontuários",
      description: "Prontuários médicos digitais",
      color: "text-red-600"
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 px-4 sm:px-0">
      {actions.map((action) => (
        <Link key={action.to} to={action.to}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="text-center p-4 sm:p-6">
              <action.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${action.color} mx-auto mb-2`} />
              <CardTitle className="text-base sm:text-lg">{action.title}</CardTitle>
              <CardDescription className="text-sm">{action.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
