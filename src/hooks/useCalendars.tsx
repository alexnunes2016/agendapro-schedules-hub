
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Calendar {
  id: string;
  name: string;
  description: string | null;
  color: string;
  is_active: boolean;
  appointments_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarData {
  name: string;
  description: string;
  color: string;
}

export const useCalendars = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCalendars = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Fetching calendars for user:', user.id);
      
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching calendars:', error);
        throw error;
      }

      console.log('Calendars fetched:', data);

      // Buscar contagem de agendamentos para cada agenda
      const calendarsWithCount = await Promise.all(
        (data || []).map(async (calendar) => {
          try {
            const { data: countData, error: countError } = await supabase
              .rpc('get_calendar_appointments_count', { calendar_id: calendar.id });
            
            if (countError) {
              console.error('Error fetching appointments count:', countError);
              return { ...calendar, appointments_count: 0 };
            }
            
            return { ...calendar, appointments_count: countData || 0 };
          } catch (error) {
            console.error('Error in appointments count:', error);
            return { ...calendar, appointments_count: 0 };
          }
        })
      );

      setCalendars(calendarsWithCount);
    } catch (error) {
      console.error('Error fetching calendars:', error);
      toast({
        title: "Erro ao carregar agendas",
        description: "Não foi possível carregar suas agendas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCalendar = async (data: CreateCalendarData) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar uma agenda.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Creating calendar:', data);
      
      const { error } = await supabase
        .from('calendars')
        .insert({
          name: data.name,
          description: data.description,
          color: data.color,
          user_id: user.id,
        });

      if (error) {
        console.error('Error creating calendar:', error);
        throw error;
      }

      toast({
        title: "Agenda criada",
        description: `Agenda "${data.name}" foi criada com sucesso.`,
      });

      await fetchCalendars();
      return true;
    } catch (error) {
      console.error('Error creating calendar:', error);
      toast({
        title: "Erro ao criar agenda",
        description: "Não foi possível criar a agenda. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCalendar = async (id: string, data: Partial<CreateCalendarData>) => {
    if (!user) return false;

    try {
      console.log('Updating calendar:', id, data);
      
      const { error } = await supabase
        .from('calendars')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating calendar:', error);
        throw error;
      }

      toast({
        title: "Agenda atualizada",
        description: "Agenda foi atualizada com sucesso.",
      });

      await fetchCalendars();
      return true;
    } catch (error) {
      console.error('Error updating calendar:', error);
      toast({
        title: "Erro ao atualizar agenda",
        description: "Não foi possível atualizar a agenda. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleCalendarStatus = async (id: string, isActive: boolean) => {
    if (!user) return false;

    try {
      console.log('Toggling calendar status:', id, isActive);
      
      const { error } = await supabase
        .from('calendars')
        .update({
          is_active: !isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error toggling calendar status:', error);
        throw error;
      }

      toast({
        title: isActive ? "Agenda desativada" : "Agenda ativada",
        description: `Agenda foi ${isActive ? 'desativada' : 'ativada'} com sucesso.`,
      });

      await fetchCalendars();
      return true;
    } catch (error) {
      console.error('Error toggling calendar status:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status da agenda. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCalendar = async (id: string, name: string) => {
    if (!user) return false;

    if (!confirm(`Tem certeza que deseja deletar a agenda "${name}"?`)) {
      return false;
    }

    try {
      console.log('Deleting calendar:', id);
      
      const { error } = await supabase
        .from('calendars')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting calendar:', error);
        throw error;
      }

      toast({
        title: "Agenda deletada",
        description: `Agenda "${name}" foi deletada com sucesso.`,
      });

      await fetchCalendars();
      return true;
    } catch (error) {
      console.error('Error deleting calendar:', error);
      toast({
        title: "Erro ao deletar agenda",
        description: "Não foi possível deletar a agenda. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCalendars();
    } else {
      setCalendars([]);
      setLoading(false);
    }
  }, [user]);

  return {
    calendars,
    loading,
    createCalendar,
    updateCalendar,
    toggleCalendarStatus,
    deleteCalendar,
    refreshCalendars: fetchCalendars,
  };
};
