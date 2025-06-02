
import { useState, useEffect, useCallback } from "react";
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = (supabase as any)
        .from('appointments')
        .select(`
          *,
          services (
            name,
            duration_minutes,
            price
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      // Se não for admin ou super admin, filtrar apenas pelos agendamentos do usuário
      if (!isAdmin && !isSuperAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, isSuperAdmin, toast]);

  const fetchServices = useCallback(async () => {
    if (!user) return;

    try {
      let query = (supabase as any)
        .from('services')
        .select('*')
        .eq('is_active', true);

      // Se não for admin ou super admin, filtrar apenas pelos serviços do usuário
      if (!isAdmin && !isSuperAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
    }
  }, [user, isAdmin, isSuperAdmin]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAppointments();
      fetchServices();
    }
  }, [user, authLoading, fetchAppointments, fetchServices]);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: string) => {
    if (!appointmentId || !status) {
      toast({
        title: "Erro de validação",
        description: "Dados incompletos para atualização",
        variant: "destructive",
      });
      return;
    }

    try {
      let query = (supabase as any)
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      // Se não for admin ou super admin, adicionar filtro do usuário
      if (!isAdmin && !isSuperAdmin) {
        query = query.eq('user_id', user?.id);
      }

      const { error } = await query;

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Agendamento ${status === 'confirmed' ? 'confirmado' : 'cancelado'} com sucesso`,
      });

      fetchAppointments();
    } catch (error: any) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  }, [isAdmin, isSuperAdmin, user?.id, fetchAppointments, toast]);

  const deleteAppointment = useCallback(async (appointmentId: string) => {
    if (!appointmentId) {
      toast({
        title: "Erro de validação",
        description: "ID do agendamento é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      let query = (supabase as any)
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      // Se não for admin ou super admin, adicionar filtro do usuário
      if (!isAdmin && !isSuperAdmin) {
        query = query.eq('user_id', user?.id);
      }

      const { error } = await query;

      if (error) throw error;

      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso",
      });

      fetchAppointments();
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erro ao excluir agendamento",
        description: error.message || "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  }, [isAdmin, isSuperAdmin, user?.id, fetchAppointments, toast]);

  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesSearch = appointment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (appointment.services?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (appointment.client_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    user,
    authLoading,
    loading,
    error,
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
