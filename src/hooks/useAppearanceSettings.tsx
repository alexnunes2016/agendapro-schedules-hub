
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { PermissionManager } from '@/utils/permissions';

interface AppearanceSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useAppearanceSettings = () => {
  const [settings, setSettings] = useState<AppearanceSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const isSuperAdmin = PermissionManager.isSuperAdminSync(profile);

  useEffect(() => {
    if (user && isSuperAdmin) {
      fetchSettings();
    }
  }, [user, isSuperAdmin]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appearance_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error: any) {
      console.error('Error fetching appearance settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting ? setting.setting_value : defaultValue;
  };

  const updateSetting = async (key: string, value: any) => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas superadmins podem alterar configurações de aparência",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appearance_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          created_by: user?.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(prev => {
        const existing = prev.find(s => s.setting_key === key);
        if (existing) {
          return prev.map(s => s.setting_key === key ? data : s);
        } else {
          return [...prev, data];
        }
      });

      toast({
        title: "Configuração atualizada",
        description: `Configuração ${key} foi atualizada com sucesso`,
      });
    } catch (error: any) {
      console.error('Error updating appearance setting:', error);
      toast({
        title: "Erro ao atualizar configuração",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSetting = async (key: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas superadmins podem deletar configurações de aparência",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appearance_settings')
        .delete()
        .eq('setting_key', key);

      if (error) throw error;

      setSettings(prev => prev.filter(s => s.setting_key !== key));

      toast({
        title: "Configuração removida",
        description: `Configuração ${key} foi removida com sucesso`,
      });
    } catch (error: any) {
      console.error('Error deleting appearance setting:', error);
      toast({
        title: "Erro ao remover configuração",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    loading,
    isSuperAdmin,
    getSetting,
    updateSetting,
    deleteSetting,
    fetchSettings
  };
};
