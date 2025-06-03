
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SystemSetting } from '@/types/admin';

export const useSystemSettings = (category?: string) => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSettings(data || []);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar configurações",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue?: any) => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  const updateSetting = async (key: string, value: any, description?: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          description,
          category: category || 'general',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast({
        title: "Configuração atualizada",
        description: "Configuração foi salva com sucesso",
      });

      fetchSettings();
    } catch (err: any) {
      console.error('Error updating setting:', err);
      toast({
        title: "Erro ao atualizar configuração",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const deleteSetting = async (key: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .delete()
        .eq('key', key);

      if (error) throw error;

      toast({
        title: "Configuração removida",
        description: "Configuração foi removida com sucesso",
      });

      fetchSettings();
    } catch (err: any) {
      console.error('Error deleting setting:', err);
      toast({
        title: "Erro ao remover configuração",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [category]);

  return {
    settings,
    loading,
    error,
    getSetting,
    updateSetting,
    deleteSetting,
    refetch: fetchSettings
  };
};
