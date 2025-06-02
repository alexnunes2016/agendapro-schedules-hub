
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AgendoProWebhookSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [agendoProId, setAgendoProId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Generate webhook URL
  useEffect(() => {
    const baseUrl = "https://lbyyogrfzwxhlbcdfhqz.supabase.co/functions/v1/agendopro-webhook";
    setWebhookUrl(baseUrl);
  }, []);

  // Load settings
  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('setting_value')
        .eq('user_id', user?.id)
        .eq('setting_key', 'agendopro_integration')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (settings?.setting_value) {
        const config = settings.setting_value as any;
        setEnabled(config.enabled || false);
        setAgendoProId(config.agendopro_id || "");
      }
    } catch (error) {
      console.error('Error loading AgendoPro settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const settingsData = {
        enabled,
        agendopro_id: agendoProId,
        webhook_url: webhookUrl,
        updated_at: new Date().toISOString(),
      };

      // Save to user_settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          setting_key: 'agendopro_integration',
          setting_value: settingsData,
        });

      if (settingsError) throw settingsError;

      // Update profile with AgendoPro ID
      if (enabled && agendoProId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ agendopro_id: agendoProId })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Configurações salvas",
        description: "Integração com AgendoPro foi configurada com sucesso.",
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "URL copiada",
      description: "URL do webhook foi copiada para a área de transferência.",
    });
  };

  const testWebhook = async () => {
    setTestingWebhook(true);
    try {
      const testPayload = {
        event: "appointment.created",
        data: {
          id: "test-" + Date.now(),
          client_name: "Cliente Teste",
          client_email: "teste@exemplo.com",
          client_phone: "(11) 99999-9999",
          service_name: "Serviço Teste",
          appointment_date: new Date().toISOString().split('T')[0],
          appointment_time: "10:00",
          status: "agendado",
          professional_id: agendoProId,
        },
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        toast({
          title: "Teste realizado com sucesso",
          description: "O webhook está funcionando corretamente.",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o webhook. Verifique as configurações.",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Integração AgendoPro</span>
          {enabled && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Ativo
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="agendopro-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <Label htmlFor="agendopro-enabled">
            Habilitar integração com AgendoPro
          </Label>
        </div>

        {enabled && (
          <>
            {/* AgendoPro Professional ID */}
            <div className="space-y-2">
              <Label htmlFor="agendopro-id">ID do Profissional no AgendoPro</Label>
              <Input
                id="agendopro-id"
                value={agendoProId}
                onChange={(e) => setAgendoProId(e.target.value)}
                placeholder="Digite seu ID de profissional"
                required
              />
              <p className="text-sm text-gray-600">
                Encontre seu ID nas configurações da sua conta AgendoPro
              </p>
            </div>

            {/* Webhook URL */}
            <div className="space-y-2">
              <Label>URL do Webhook</Label>
              <div className="flex space-x-2">
                <Input
                  value={webhookUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyWebhookUrl}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Configure esta URL no seu painel AgendoPro para receber notificações
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">
                    Como configurar no AgendoPro:
                  </h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Acesse as configurações da sua conta AgendoPro</li>
                    <li>Vá para "Integrações" ou "Webhooks"</li>
                    <li>Adicione a URL do webhook acima</li>
                    <li>Configure para enviar eventos de agendamento</li>
                    <li>Teste a integração usando o botão abaixo</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button 
                onClick={saveSettings}
                disabled={loading || !agendoProId}
                className="flex-1"
              >
                {loading ? "Salvando..." : "Salvar Configurações"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={testWebhook}
                disabled={testingWebhook || !enabled || !agendoProId}
              >
                {testingWebhook ? "Testando..." : "Testar Webhook"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AgendoProWebhookSettings;
