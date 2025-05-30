
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, Mail, MessageSquare, Settings, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    email_enabled: true,
    whatsapp_enabled: false,
    appointment_reminders: true,
    appointment_confirmations: true,
    new_appointments: true,
    cancellations: true,
    reminder_hours: 24,
    whatsapp_token: "",
    email_templates: {
      reminder: "Olá {nome}, você tem um agendamento amanhã às {hora}.",
      confirmation: "Seu agendamento foi confirmado para {data} às {hora}.",
      cancellation: "Seu agendamento foi cancelado. Entre em contato para reagendar."
    }
  });

  const handleSave = () => {
    // Em produção, salvaria no banco
    toast({
      title: "Configurações Salvas",
      description: "As configurações de notificação foram atualizadas com sucesso.",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateTemplate = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      email_templates: {
        ...prev.email_templates,
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Bell className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Configurações de Notificações
                </h1>
              </div>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configurações Gerais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-enabled">Notificações por Email</Label>
                  <p className="text-sm text-gray-600">Enviar notificações por email</p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={settings.email_enabled}
                  onCheckedChange={(checked) => updateSetting('email_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp-enabled">Notificações por WhatsApp</Label>
                  <p className="text-sm text-gray-600">Enviar notificações via WhatsApp</p>
                </div>
                <Switch
                  id="whatsapp-enabled"
                  checked={settings.whatsapp_enabled}
                  onCheckedChange={(checked) => updateSetting('whatsapp_enabled', checked)}
                />
              </div>

              {settings.whatsapp_enabled && (
                <div>
                  <Label htmlFor="whatsapp-token">Token do WhatsApp</Label>
                  <Input
                    id="whatsapp-token"
                    type="password"
                    value={settings.whatsapp_token}
                    onChange={(e) => updateSetting('whatsapp_token', e.target.value)}
                    placeholder="Insira seu token do WhatsApp"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="reminder-hours">Lembrete (horas antes)</Label>
                <Input
                  id="reminder-hours"
                  type="number"
                  value={settings.reminder_hours}
                  onChange={(e) => updateSetting('reminder_hours', parseInt(e.target.value))}
                  min="1"
                  max="168"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Notificação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Tipos de Notificação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Lembretes de Agendamento</Label>
                  <p className="text-sm text-gray-600">Lembrar clientes sobre agendamentos</p>
                </div>
                <Switch
                  checked={settings.appointment_reminders}
                  onCheckedChange={(checked) => updateSetting('appointment_reminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Confirmações</Label>
                  <p className="text-sm text-gray-600">Confirmar agendamentos marcados</p>
                </div>
                <Switch
                  checked={settings.appointment_confirmations}
                  onCheckedChange={(checked) => updateSetting('appointment_confirmations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Novos Agendamentos</Label>
                  <p className="text-sm text-gray-600">Notificar sobre novos agendamentos</p>
                </div>
                <Switch
                  checked={settings.new_appointments}
                  onCheckedChange={(checked) => updateSetting('new_appointments', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Cancelamentos</Label>
                  <p className="text-sm text-gray-600">Notificar sobre cancelamentos</p>
                </div>
                <Switch
                  checked={settings.cancellations}
                  onCheckedChange={(checked) => updateSetting('cancellations', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates de Mensagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Templates de Mensagem</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reminder-template">Template de Lembrete</Label>
              <Textarea
                id="reminder-template"
                value={settings.email_templates.reminder}
                onChange={(e) => updateTemplate('reminder', e.target.value)}
                placeholder="Template para lembretes..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Variáveis disponíveis: {"{nome}"}, {"{hora}"}, {"{data}"}, {"{servico}"}
              </p>
            </div>

            <div>
              <Label htmlFor="confirmation-template">Template de Confirmação</Label>
              <Textarea
                id="confirmation-template"
                value={settings.email_templates.confirmation}
                onChange={(e) => updateTemplate('confirmation', e.target.value)}
                placeholder="Template para confirmações..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="cancellation-template">Template de Cancelamento</Label>
              <Textarea
                id="cancellation-template"
                value={settings.email_templates.cancellation}
                onChange={(e) => updateTemplate('cancellation', e.target.value)}
                placeholder="Template para cancelamentos..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
