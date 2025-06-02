
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

interface ClientInfoFormProps {
  formData: {
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    notes: string;
  };
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const ClientInfoForm = ({ formData, onFieldChange, onSubmit, onBack }: ClientInfoFormProps) => {
  const isFormValid = formData.clientName && formData.clientPhone && formData.clientEmail;

  return (
    <Card className="mx-4 sm:mx-0">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Seus dados
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Preencha suas informações para confirmar o agendamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm sm:text-base">Nome completo *</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => onFieldChange("clientName", e.target.value)}
              placeholder="Seu nome completo"
              required
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone" className="text-sm sm:text-base">Telefone/WhatsApp *</Label>
            <Input
              id="clientPhone"
              value={formData.clientPhone}
              onChange={(e) => onFieldChange("clientPhone", e.target.value)}
              placeholder="(11) 99999-9999"
              required
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail" className="text-sm sm:text-base">Email *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => onFieldChange("clientEmail", e.target.value)}
              placeholder="seu@email.com"
              required
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm sm:text-base">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFieldChange("notes", e.target.value)}
              placeholder="Alguma informação adicional..."
              rows={3}
              className="text-sm sm:text-base resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack} 
              className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base"
            >
              Voltar
            </Button>
            <Button 
              type="submit"
              disabled={!isFormValid}
              className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base"
            >
              Confirmar Agendamento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientInfoForm;
