
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DashboardRecentAppointmentsProps {
  appointments: any[];
}

const DashboardRecentAppointments = ({ appointments }: DashboardRecentAppointmentsProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'confirmed': { label: 'Confirmado', class: 'bg-green-100 text-green-800' },
      'pending': { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800' },
      'cancelled': { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
      'completed': { label: 'Concluído', class: 'bg-blue-100 text-blue-800' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Próximos Agendamentos</CardTitle>
          <Link to="/appointments">
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment: any) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{appointment.client_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.services?.name} - {new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum agendamento próximo</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecentAppointments;
