
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Seus dados
        </CardTitle>
        <CardDescription>
          Preencha suas informações para confirmar o agendamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome completo *</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => onFieldChange("clientName", e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Telefone/WhatsApp *</Label>
            <Input
              id="clientPhone"
              value={formData.clientPhone}
              onChange={(e) => onFieldChange("clientPhone", e.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => onFieldChange("clientEmail", e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFieldChange("notes", e.target.value)}
              placeholder="Alguma informação adicional..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Voltar
            </Button>
            <Button 
              type="submit"
              disabled={!isFormValid}
              className="flex-1"
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
