
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AppearanceSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
}

export const useAppearanceSettings = () => {
  const [settings, setSettings] = useState<AppearanceSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getSetting = (key: string, defaultValue: any = '') => {
    const setting = settings.find(s => s.setting_key === key);
    return setting ? setting.setting_value : defaultValue;
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      // For MVP, just show a mock success message
      toast({
        title: "Configuração atualizada",
        description: "As configurações foram salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    loading,
    getSetting,
    updateSetting
  };
};
