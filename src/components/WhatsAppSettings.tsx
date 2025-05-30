
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Save } from "lucide-react";

interface WhatsAppSettingsProps {
  userId?: string;
  isGlobal?: boolean;
}

const WhatsAppSettings = ({ userId, isGlobal = false }: WhatsAppSettingsProps) => {
  const [settings, setSettings] = useState({
    webhookUrl: "",
    enabled: false
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, [userId, isGlobal]);

  const fetchSettings = async () => {
    try {
      if (isGlobal) {
        // Buscar configurações globais do sistema
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
        // Buscar configurações específicas do usuário
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
        // Salvar configurações globais
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
            .update(update)
            .eq('setting_key', update.setting_key);

          if (error) throw error;
        }
      } else if (userId) {
        // Salvar configurações do usuário
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Configurações WhatsApp {isGlobal ? '(Global)' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="whatsapp-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
          />
          <Label htmlFor="whatsapp-enabled">Habilitar notificações WhatsApp</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook N8N</Label>
          <Input
            id="webhook-url"
            value={settings.webhookUrl}
            onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
            placeholder="https://seu-n8n.com/webhook/whatsapp"
            disabled={!settings.enabled}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            URL do webhook do N8N para envio de mensagens WhatsApp
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
