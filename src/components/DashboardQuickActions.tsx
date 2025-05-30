
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Link to="/appointments">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Agendamentos</CardTitle>
            <CardDescription>Visualizar e gerenciar agendamentos</CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <Link to="/clients">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Clientes</CardTitle>
            <CardDescription>Lista de clientes e histórico</CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <Link to="/services">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Clock className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Serviços</CardTitle>
            <CardDescription>Configurar serviços e horários</CardDescription>
          </CardHeader>
        </Card>
      </Link>

      {canAccessMedicalRecords() && (
        <Link to="/medical-records">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Prontuários</CardTitle>
              <CardDescription>Prontuários médicos digitais</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}
    </div>
  );
};

export default DashboardQuickActions;
