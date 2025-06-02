
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WhatsAppWebhookInputProps {
  webhookUrl: string;
  onChange: (url: string) => void;
  disabled: boolean;
}

const WhatsAppWebhookInput = ({ webhookUrl, onChange, disabled }: WhatsAppWebhookInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="webhook-url">URL do Webhook N8N</Label>
      <Input
        id="webhook-url"
        value={webhookUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://seu-n8n.com/webhook/whatsapp"
        disabled={disabled}
      />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        URL do webhook do N8N para envio de mensagens WhatsApp
      </p>
    </div>
  );
};

export default WhatsAppWebhookInput;
