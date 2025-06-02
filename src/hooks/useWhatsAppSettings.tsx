
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppSettings {
  webhookUrl: string;
  enabled: boolean;
}

export const useWhatsAppSettings = (userId?: string, isGlobal = false) => {
  const [settings, setSettings] = useState<WhatsAppSettings>({
    webhookUrl: "",
    enabled: false
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, [userId, isGlobal]);

  const fetchSettings = async () => {
    try {
      if (isGlobal) {
        const { data, error } = await (supabase as any)
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['whatsapp_webhook_url', 'whatsapp_enabled']);

        if (error) throw error;

        const webhookUrl = data.find((s: any) => s.setting_key === 'whatsapp_webhook_url')?.setting_value || "";
        const enabled = data.find((s: any) => s.setting_key === 'whatsapp_enabled')?.setting_value || false;

        setSettings({
          webhookUrl: typeof webhookUrl === 'string' ? webhookUrl.replace(/"/g, '') : '',
          enabled: Boolean(enabled)
        });
      } else if (userId) {
        const { data, error } = await (supabase as any)
          .from('user_settings')
          .select('setting_key, setting_value')
          .eq('user_id', userId)
          .in('setting_key', ['whatsapp_webhook_url', 'whatsapp_enabled']);

        if (error) throw error;

        const webhookUrl = data.find((s: any) => s.setting_key === 'whatsapp_webhook_url')?.setting_value || "";
        const enabled = data.find((s: any) => s.setting_key === 'whatsapp_enabled')?.setting_value || false;

        setSettings({
          webhookUrl: typeof webhookUrl === 'string' ? webhookUrl.replace(/"/g, '') : '',
          enabled: Boolean(enabled)
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configurações WhatsApp:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isGlobal) {
        const updates = [
          {
            setting_key: 'whatsapp_webhook_url',
            setting_value: JSON.stringify(settings.webhookUrl),
            updated_at: new Date().toISOString()
          },
          {
            setting_key: 'whatsapp_enabled',
            setting_value: settings.enabled,
            updated_at: new Date().toISOString()
          }
        ];

        for (const update of updates) {
          const { error } = await (supabase as any)
            .from('system_settings')
            .upsert(update, { onConflict: 'setting_key' });

          if (error) throw error;
        }
      } else if (userId) {
        const updates = [
          {
            user_id: userId,
            setting_key: 'whatsapp_webhook_url',
            setting_value: JSON.stringify(settings.webhookUrl)
          },
          {
            user_id: userId,
            setting_key: 'whatsapp_enabled',
            setting_value: settings.enabled
          }
        ];

        for (const update of updates) {
          const { error } = await (supabase as any)
            .from('user_settings')
            .upsert(update, { onConflict: 'user_id,setting_key' });

          if (error) throw error;
        }
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações do WhatsApp foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!settings.webhookUrl || !settings.enabled) {
      toast({
        title: "Configuração incompleta",
        description: "Configure e habilite o WhatsApp antes de testar",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(settings.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          phone: '5511999999999',
          message: '🧪 *Teste de Configuração*\n\nSeu webhook N8N está funcionando corretamente!\n\n_AgendoPro_',
          test: true
        }),
      });

      toast({
        title: "Teste enviado",
        description: "Requisição enviada para o webhook. Verifique se a mensagem foi recebida no N8N.",
      });

    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível conectar com o webhook. Verifique a URL.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const updateSettings = (newSettings: Partial<WhatsAppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    loading,
    testing,
    handleSave,
    testWebhook,
    updateSettings
  };
};
