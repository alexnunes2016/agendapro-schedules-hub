
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAppointmentManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { isSuperAdmin } = useSuperAdminCheck();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAppointments();
      fetchServices();
    }
  }, [user, authLoading]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('appointments')
        .select(`
          *,
          services (
            name,
            duration_minutes,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await (supabase as any)
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Agendamento ${status === 'confirmed' ? 'confirmado' : 'cancelado'} com sucesso`,
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('appointments')
        .delete()
        .eq('id', appointmentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso",
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erro ao excluir agendamento",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesSearch = appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (appointment.services?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    user,
    authLoading,
    loading,
    isAdmin,
    isSuperAdmin,
    appointments,
    services,
    searchTerm,
    statusFilter,
    filteredAppointments,
    setSearchTerm,
    setStatusFilter,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
  };
};
