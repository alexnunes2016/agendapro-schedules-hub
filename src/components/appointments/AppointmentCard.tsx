
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, Edit, Check, X, Trash2 } from "lucide-react";

interface AppointmentCardProps {
  appointment: any;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  onUpdateStatus: (appointmentId: string, status: string) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export const AppointmentCard = ({
  appointment,
  isAdmin,
  isSuperAdmin,
  onUpdateStatus,
  onDeleteAppointment
}: AppointmentCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {appointment.client_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {appointment.services?.name || 'Serviço não especificado'}
                </p>
              </div>
              {getStatusBadge(appointment.status)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{appointment.appointment_time} ({appointment.services?.duration_minutes || 0}min)</span>
              </div>
              {appointment.client_phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{appointment.client_phone}</span>
                </div>
              )}
            </div>
            
            {appointment.client_email && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{appointment.client_email}</span>
                </div>
              </div>
            )}
            
            {appointment.notes && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Observações:</strong> {appointment.notes}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2 lg:items-end">
            {appointment.services?.price && (
              <div className="text-lg font-bold text-blue-600">
                R$ {parseFloat(appointment.services.price).toFixed(2)}
              </div>
            )}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              {appointment.status === "pending" && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar
                </Button>
              )}
              {appointment.status === "confirmed" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-600"
                  onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              )}
              {(isAdmin || isSuperAdmin) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-600"
                  onClick={() => onDeleteAppointment(appointment.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
