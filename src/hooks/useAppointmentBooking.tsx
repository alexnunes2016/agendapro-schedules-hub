
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useAppointmentBooking = (open: boolean) => {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Horários base disponíveis
  const baseAvailableSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  useEffect(() => {
    if (open && user) {
      fetchServices();
    }
  }, [open, user]);

  // Carregar horários ocupados quando a data for selecionada
  useEffect(() => {
    if (appointmentDate && user) {
      fetchBookedSlots(appointmentDate);
    } else {
      setBookedSlots([]);
    }
  }, [appointmentDate, user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchBookedSlots = async (selectedDate: string) => {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('user_id', user?.id)
        .eq('appointment_date', selectedDate)
        .in('status', ['confirmed', 'pending']);

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      const bookedTimes = appointments?.map(apt => apt.appointment_time) || [];
      setBookedSlots(bookedTimes);
    } catch (error) {
      console.error('Erro ao carregar horários ocupados:', error);
    }
  };

  const checkTimeSlotAvailability = async (date: string, time: string) => {
    try {
      const { data: existingAppointment, error } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', user?.id)
        .eq('appointment_date', date)
        .eq('appointment_time', time)
        .in('status', ['confirmed', 'pending'])
        .maybeSingle();

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      return !existingAppointment;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  };

  const createAppointment = async (onSuccess: () => void) => {
    if (!user) return;

    setLoading(true);
    try {
      // Verificar se o horário está disponível
      const isAvailable = await checkTimeSlotAvailability(appointmentDate, appointmentTime);
      
      if (!isAvailable) {
        toast({
          title: "Horário não disponível",
          description: "Já existe um agendamento para este horário. Por favor, escolha outro horário.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await (supabase as any)
        .from('appointments')
        .insert({
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          service_id: serviceId || null,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          notes,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso",
      });

      // Reset form
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName("");
    setClientPhone("");
    setClientEmail("");
    setServiceId("");
    setAppointmentDate("");
    setAppointmentTime("");
    setNotes("");
  };

  // Filtrar horários disponíveis removendo os já ocupados
  const availableSlots = baseAvailableSlots.filter(slot => !bookedSlots.includes(slot));

  return {
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    clientEmail,
    setClientEmail,
    serviceId,
    setServiceId,
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
    notes,
    setNotes,
    services,
    loading,
    availableSlots,
    createAppointment,
    resetForm
  };
};
