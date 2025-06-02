
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Professional {
  id: string;
  user_id: string;
  organization_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  specialization: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfessionalData {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  specialization?: string;
  organization_id?: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProfessionals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Fetching professionals for user:', user.id);
      
      // Usando any para contornar limitações temporárias do tipo
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false }) as any;

      if (error) {
        console.error('Error fetching professionals:', error);
        throw error;
      }

      console.log('Professionals fetched:', data);
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Erro ao carregar profissionais",
        description: "Não foi possível carregar os profissionais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfessional = async (data: CreateProfessionalData) => {
    if (!user) return false;

    try {
      console.log('Creating professional:', data);
      
      // Usando any para contornar limitações temporárias do tipo
      const { error } = await supabase
        .from('professionals')
        .insert({
          ...data,
          created_by: user.id,
        }) as any;

      if (error) {
        console.error('Error creating professional:', error);
        throw error;
      }

      toast({
        title: "Profissional criado",
        description: `Profissional "${data.name}" foi criado com sucesso.`,
      });

      await fetchProfessionals();
      return true;
    } catch (error) {
      console.error('Error creating professional:', error);
      toast({
        title: "Erro ao criar profissional",
        description: "Não foi possível criar o profissional. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProfessional = async (id: string, data: Partial<CreateProfessionalData>) => {
    if (!user) return false;

    try {
      console.log('Updating professional:', id, data);
      
      const { error } = await supabase
        .from('professionals')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('created_by', user.id);

      if (error) {
        console.error('Error updating professional:', error);
        throw error;
      }

      toast({
        title: "Profissional atualizado",
        description: "Profissional foi atualizado com sucesso.",
      });

      await fetchProfessionals();
      return true;
    } catch (error) {
      console.error('Error updating professional:', error);
      toast({
        title: "Erro ao atualizar profissional",
        description: "Não foi possível atualizar o profissional. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleProfessionalStatus = async (id: string, isActive: boolean) => {
    if (!user) return false;

    try {
      console.log('Toggling professional status:', id, isActive);
      
      const { error } = await supabase
        .from('professionals')
        .update({
          is_active: !isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('created_by', user.id);

      if (error) {
        console.error('Error toggling professional status:', error);
        throw error;
      }

      toast({
        title: isActive ? "Profissional desativado" : "Profissional ativado",
        description: `Profissional foi ${isActive ? 'desativado' : 'ativado'} com sucesso.`,
      });

      await fetchProfessionals();
      return true;
    } catch (error) {
      console.error('Error toggling professional status:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do profissional. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProfessional = async (id: string, name: string) => {
    if (!user) return false;

    if (!confirm(`Tem certeza que deseja deletar o profissional "${name}"?`)) {
      return false;
    }

    try {
      console.log('Deleting professional:', id);
      
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id);

      if (error) {
        console.error('Error deleting professional:', error);
        throw error;
      }

      toast({
        title: "Profissional deletado",
        description: `Profissional "${name}" foi deletado com sucesso.`,
      });

      await fetchProfessionals();
      return true;
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        title: "Erro ao deletar profissional",
        description: "Não foi possível deletar o profissional. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfessionals();
    } else {
      setProfessionals([]);
      setLoading(false);
    }
  }, [user]);

  return {
    professionals,
    loading,
    createProfessional,
    updateProfessional,
    toggleProfessionalStatus,
    deleteProfessional,
    refreshProfessionals: fetchProfessionals,
  };
};
