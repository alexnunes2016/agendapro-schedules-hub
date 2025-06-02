
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CalendarSchedule {
  id: string;
  calendar_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateScheduleData {
  calendar_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export const useCalendarSchedules = (calendarId?: string) => {
  const [schedules, setSchedules] = useState<CalendarSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSchedules = async () => {
    if (!user || !calendarId) return;
    
    try {
      setLoading(true);
      console.log('Fetching schedules for calendar:', calendarId);
      
      // Usando any para contornar limitações temporárias do tipo
      const { data, error } = await supabase
        .from('calendar_schedules')
        .select('*')
        .eq('calendar_id', calendarId)
        .order('day_of_week', { ascending: true }) as any;

      if (error) {
        console.error('Error fetching schedules:', error);
        throw error;
      }

      console.log('Schedules fetched:', data);
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Erro ao carregar horários",
        description: "Não foi possível carregar os horários da agenda.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (data: CreateScheduleData) => {
    if (!user) return false;

    try {
      console.log('Creating schedule:', data);
      
      // Usando any para contornar limitações temporárias do tipo
      const { error } = await supabase
        .from('calendar_schedules')
        .insert(data) as any;

      if (error) {
        console.error('Error creating schedule:', error);
        throw error;
      }

      toast({
        title: "Horário criado",
        description: "Horário de funcionamento criado com sucesso.",
      });

      await fetchSchedules();
      return true;
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Erro ao criar horário",
        description: "Não foi possível criar o horário. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSchedule = async (id: string, data: Partial<CreateScheduleData>) => {
    if (!user) return false;

    try {
      console.log('Updating schedule:', id, data);
      
      // Usando any para contornar limitações temporárias do tipo
      const { error } = await supabase
        .from('calendar_schedules')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id) as any;

      if (error) {
        console.error('Error updating schedule:', error);
        throw error;
      }

      toast({
        title: "Horário atualizado",
        description: "Horário foi atualizado com sucesso.",
      });

      await fetchSchedules();
      return true;
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: "Erro ao atualizar horário",
        description: "Não foi possível atualizar o horário. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!user) return false;

    try {
      console.log('Deleting schedule:', id);
      
      // Usando any para contornar limitações temporárias do tipo
      const { error } = await supabase
        .from('calendar_schedules')
        .delete()
        .eq('id', id) as any;

      if (error) {
        console.error('Error deleting schedule:', error);
        throw error;
      }

      toast({
        title: "Horário deletado",
        description: "Horário foi deletado com sucesso.",
      });

      await fetchSchedules();
      return true;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Erro ao deletar horário",
        description: "Não foi possível deletar o horário. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user && calendarId) {
      fetchSchedules();
    } else {
      setSchedules([]);
      setLoading(false);
    }
  }, [user, calendarId]);

  return {
    schedules,
    loading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refreshSchedules: fetchSchedules,
  };
};
