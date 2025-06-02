
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
      <Card className="text-center py-8 sm:py-12 mx-4 sm:mx-0">
        <CardContent className="px-4">
          <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
            {searchTerm || statusFilter !== "all" 
              ? "Tente ajustar os filtros de busca" 
              : "Você ainda não possui agendamentos"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
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
