
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentsListProps {
  filteredAppointments: any[];
  searchTerm: string;
  statusFilter: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  onUpdateStatus: (appointmentId: string, status: string) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export const AppointmentsList = ({
  filteredAppointments,
  searchTerm,
  statusFilter,
  isAdmin,
  isSuperAdmin,
  onUpdateStatus,
  onDeleteAppointment
}: AppointmentsListProps) => {
  if (filteredAppointments.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            {searchTerm || statusFilter !== "all" 
              ? "Tente ajustar os filtros de busca" 
              : "Você ainda não possui agendamentos"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAppointments.map((appointment: any) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          onUpdateStatus={onUpdateStatus}
          onDeleteAppointment={onDeleteAppointment}
        />
      ))}
    </div>
  );
};
