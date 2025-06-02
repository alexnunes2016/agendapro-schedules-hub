
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailSettings {
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  email_confirmation_enabled: boolean;
}

const EmailSettingsTab = () => {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: "",
    smtp_port: "587",
    smtp_user: "",
    smtp_password: "",
    smtp_from_email: "",
    smtp_from_name: "AgendoPro",
    email_confirmation_enabled: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password',
          'smtp_from_email', 'smtp_from_name', 'email_confirmation_enabled'
        ]);

      if (error) throw error;

      const emailSettingsData = data.reduce((acc: any, item: any) => {
        let value = item.setting_value;
        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        acc[item.setting_key] = value;
        return acc;
      }, {});

      setEmailSettings({
        smtp_host: emailSettingsData.smtp_host || "",
        smtp_port: emailSettingsData.smtp_port || "587",
        smtp_user: emailSettingsData.smtp_user || "",
        smtp_password: emailSettingsData.smtp_password || "",
        smtp_from_email: emailSettingsData.smtp_from_email || "",
        smtp_from_name: emailSettingsData.smtp_from_name || "AgendoPro",
        email_confirmation_enabled: Boolean(emailSettingsData.email_confirmation_enabled)
      });
    } catch (error) {
      console.error('Error fetching email settings:', error);
    }
  };

  const saveEmailSettings = async () => {
    try {
      const updates = Object.entries(emailSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: typeof value === 'string' ? JSON.stringify(value) : value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await (supabase as any)
          .from('system_settings')
          .update(update)
          .eq('setting_key', update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Configurações de email salvas",
        description: "As configurações SMTP foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações de email",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Configurações SMTP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp_host">Servidor SMTP</Label>
            <Input
              id="smtp_host"
              value={emailSettings.smtp_host}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
              placeholder="smtp.gmail.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_port">Porta SMTP</Label>
            <Input
              id="smtp_port"
              value={emailSettings.smtp_port}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
              placeholder="587"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_user">Usuário SMTP</Label>
            <Input
              id="smtp_user"
              value={emailSettings.smtp_user}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
              placeholder="seu-email@gmail.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_password">Senha SMTP</Label>
            <Input
              id="smtp_password"
              type="password"
              value={emailSettings.smtp_password}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
              placeholder="sua-senha-app"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_from_email">Email Remetente</Label>
            <Input
              id="smtp_from_email"
              value={emailSettings.smtp_from_email}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_from_email: e.target.value }))}
              placeholder="noreply@agendopro.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_from_name">Nome Remetente</Label>
            <Input
              id="smtp_from_name"
              value={emailSettings.smtp_from_name}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_from_name: e.target.value }))}
              placeholder="AgendoPro"
            />
          </div>
        </div>
        
        <Button onClick={saveEmailSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações SMTP
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailSettingsTab;
