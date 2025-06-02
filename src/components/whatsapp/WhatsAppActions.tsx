
import { Button } from "@/components/ui/button";
import { Save, CheckCircle } from "lucide-react";

interface WhatsAppActionsProps {
  onSave: () => void;
  onTest: () => void;
  loading: boolean;
  testing: boolean;
  enabled: boolean;
  webhookUrl: string;
}

const WhatsAppActions = ({ 
  onSave, 
  onTest, 
  loading, 
  testing, 
  enabled, 
  webhookUrl 
}: WhatsAppActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        onClick={onSave} 
        disabled={loading} 
        className="bg-green-600 hover:bg-green-700 text-white flex-1"
      >
        <Save className="h-4 w-4 mr-2" />
        {loading ? "Salvando..." : "Salvar Configurações"}
      </Button>
      
      <Button 
        onClick={onTest} 
        disabled={testing || !enabled || !webhookUrl}
        variant="outline"
        className="border-green-600 text-green-600 hover:bg-green-50"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        {testing ? "Testando..." : "Testar"}
      </Button>
    </div>
  );
};

export default WhatsAppActions;
