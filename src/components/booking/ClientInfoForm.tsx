
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface ClientData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

interface ClientInfoFormProps {
  formData: ClientData;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const ClientInfoForm = ({ formData, onFieldChange, onSubmit, onBack }: ClientInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Seus dados
        </CardTitle>
        <CardDescription>
          Precisamos de algumas informações para confirmar o agendamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nome completo *</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => onFieldChange("clientName", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="clientPhone">Telefone *</Label>
            <Input
              id="clientPhone"
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => onFieldChange("clientPhone", e.target.value)}
              placeholder="(11) 99999-9999"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="clientEmail">E-mail *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => onFieldChange("clientEmail", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => onFieldChange("notes", e.target.value)}
              placeholder="Alguma informação adicional..."
              className="mt-1"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Voltar
            </Button>
            <Button type="submit" className="flex-1">
              Agendar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientInfoForm;
