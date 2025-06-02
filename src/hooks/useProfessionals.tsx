
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Professional {
  id: string;
  user_id: string;
  organization_id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  specialization?: string;
  is_active: boolean;
  calendar_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfessionals();
    }
  }, [user]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error: any) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Erro ao carregar profissionais",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfessional = async (professionalData: {
    name: string;
    email: string;
    phone?: string;
    specialization?: string;
  }) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      // Primeiro, criar a agenda para o profissional
      const { data: calendarData, error: calendarError } = await supabase
        .from('calendars')
        .insert({
          name: `Agenda - ${professionalData.name}`,
          description: `Agenda do profissional ${professionalData.name}`,
          user_id: user.id,
          color: '#3B82F6',
          is_active: true
        })
        .select()
        .single();

      if (calendarError) throw calendarError;

      // Agora criar o profissional com referência à agenda
      const { data: professionalInsert, error: professionalError } = await supabase
        .from('professionals')
        .insert({
          ...professionalData,
          user_id: user.id,
          calendar_id: calendarData.id,
          created_by: user.id,
          role: 'professional'
        })
        .select()
        .single();

      if (professionalError) {
        // Se falhou, remover a agenda criada
        await supabase.from('calendars').delete().eq('id', calendarData.id);
        throw professionalError;
      }

      // Criar horários padrão para a agenda
      const defaultSchedules = [
        { day_of_week: 1, start_time: '08:00', end_time: '12:00' }, // Segunda
        { day_of_week: 1, start_time: '14:00', end_time: '18:00' },
        { day_of_week: 2, start_time: '08:00', end_time: '12:00' }, // Terça
        { day_of_week: 2, start_time: '14:00', end_time: '18:00' },
        { day_of_week: 3, start_time: '08:00', end_time: '12:00' }, // Quarta
        { day_of_week: 3, start_time: '14:00', end_time: '18:00' },
        { day_of_week: 4, start_time: '08:00', end_time: '12:00' }, // Quinta
        { day_of_week: 4, start_time: '14:00', end_time: '18:00' },
        { day_of_week: 5, start_time: '08:00', end_time: '12:00' }, // Sexta
        { day_of_week: 5, start_time: '14:00', end_time: '18:00' },
      ];

      const scheduleInserts = defaultSchedules.map(schedule => ({
        ...schedule,
        calendar_id: calendarData.id
      }));

      await supabase.from('calendar_schedules').insert(scheduleInserts);

      setProfessionals(prev => [professionalInsert, ...prev]);
      
      toast({
        title: "Profissional criado com sucesso",
        description: `${professionalData.name} foi adicionado com agenda própria`,
      });

      return professionalInsert;
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast({
        title: "Erro ao criar profissional",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user?.id)
        .select()
        .single();

      if (error) throw error;

      setProfessionals(prev => 
        prev.map(prof => prof.id === id ? { ...prof, ...updates } : prof)
      );

      toast({
        title: "Profissional atualizado",
        description: "Dados do profissional atualizados com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast({
        title: "Erro ao atualizar profissional",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProfessional = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o profissional ${name}?`)) {
      return;
    }

    try {
      const professional = professionals.find(p => p.id === id);
      
      // Deletar profissional (a agenda será mantida para preservar histórico)
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;

      // Se tiver agenda associada, apenas desativá-la
      if (professional?.calendar_id) {
        await supabase
          .from('calendars')
          .update({ is_active: false })
          .eq('id', professional.calendar_id);
      }

      setProfessionals(prev => prev.filter(prof => prof.id !== id));
      
      toast({
        title: "Profissional excluído",
        description: `${name} foi removido com sucesso`,
      });
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast({
        title: "Erro ao excluir profissional",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleProfessionalStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateProfessional(id, { is_active: !currentStatus });
      
      // Também atualizar status da agenda associada
      const professional = professionals.find(p => p.id === id);
      if (professional?.calendar_id) {
        await supabase
          .from('calendars')
          .update({ is_active: !currentStatus })
          .eq('id', professional.calendar_id);
      }
    } catch (error) {
      // Error already handled in updateProfessional
    }
  };

  return {
    professionals,
    loading,
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    toggleProfessionalStatus
  };
};
