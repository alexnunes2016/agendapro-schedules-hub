
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WhatsAppToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const WhatsAppToggle = ({ enabled, onToggle }: WhatsAppToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="whatsapp-enabled"
        checked={enabled}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="whatsapp-enabled">
        <span className={enabled ? "text-green-600 font-medium" : ""}>
          Habilitar notificações WhatsApp
        </span>
      </Label>
      {enabled && (
        <div className="flex items-center text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          <span className="text-sm">Ativo</span>
        </div>
      )}
    </div>
  );
};

export default WhatsAppToggle;
