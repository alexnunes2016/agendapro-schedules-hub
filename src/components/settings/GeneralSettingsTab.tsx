
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NewSettingForm from "./NewSettingForm";
import SettingsListView from "./SettingsListView";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
}

const GeneralSettingsTab = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (id: string, key: string, value: string, description: string) => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      const { error } = await (supabase as any)
        .from('system_settings')
        .update({
          setting_value: parsedValue,
          description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuração atualizada",
        description: "A configuração foi salva com sucesso",
      });

      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Erro ao atualizar configuração",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const deleteSetting = async (id: string, key: string) => {
    if (!confirm(`Tem certeza que deseja deletar a configuração "${key}"?`)) {
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('system_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuração deletada",
        description: "A configuração foi removida com sucesso",
      });

      fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast({
        title: "Erro ao deletar configuração",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <NewSettingForm onSettingCreated={fetchSettings} />
      <SettingsListView
        settings={settings}
        loading={loading}
        onUpdate={updateSetting}
        onDelete={deleteSetting}
      />
    </div>
  );
};

export default GeneralSettingsTab;
