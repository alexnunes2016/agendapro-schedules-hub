
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useWhatsAppSettings } from "@/hooks/useWhatsAppSettings";
import WhatsAppToggle from "@/components/whatsapp/WhatsAppToggle";
import WhatsAppWebhookInput from "@/components/whatsapp/WhatsAppWebhookInput";
import WhatsAppActions from "@/components/whatsapp/WhatsAppActions";
import WhatsAppInstructions from "@/components/whatsapp/WhatsAppInstructions";

interface WhatsAppSettingsProps {
  userId?: string;
  isGlobal?: boolean;
}

const WhatsAppSettings = ({ userId, isGlobal = false }: WhatsAppSettingsProps) => {
  const {
    settings,
    loading,
    testing,
    handleSave,
    testWebhook,
    updateSettings
  } = useWhatsAppSettings(userId, isGlobal);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Notificações WhatsApp {isGlobal ? '(Global)' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <WhatsAppToggle
          enabled={settings.enabled}
          onToggle={(enabled) => updateSettings({ enabled })}
        />

        <WhatsAppWebhookInput
          webhookUrl={settings.webhookUrl}
          onChange={(webhookUrl) => updateSettings({ webhookUrl })}
          disabled={!settings.enabled}
        />

        <WhatsAppActions
          onSave={handleSave}
          onTest={testWebhook}
          loading={loading}
          testing={testing}
          enabled={settings.enabled}
          webhookUrl={settings.webhookUrl}
        />

        {settings.enabled && <WhatsAppInstructions />}
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
