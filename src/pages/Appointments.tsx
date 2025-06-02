
import { useAppointmentManagement } from "@/hooks/useAppointmentManagement";
import { AppointmentHeader } from "@/components/appointments/AppointmentHeader";
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import Footer from "@/components/Footer";

const Appointments = () => {
  const {
    user,
    authLoading,
    loading,
    isAdmin,
    isSuperAdmin,
    searchTerm,
    statusFilter,
    filteredAppointments,
    setSearchTerm,
    setStatusFilter,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
  } = useAppointmentManagement();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-base sm:text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <AppointmentHeader onAppointmentCreated={fetchAppointments} />

      <div className="flex-1 p-4 sm:p-6">
        <AppointmentFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        <AppointmentsList
          filteredAppointments={filteredAppointments}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          onUpdateStatus={updateAppointmentStatus}
          onDeleteAppointment={deleteAppointment}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Appointments;
