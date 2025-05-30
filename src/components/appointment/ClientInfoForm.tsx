
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ClientInfoFormProps {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  onClientNameChange: (value: string) => void;
  onClientPhoneChange: (value: string) => void;
  onClientEmailChange: (value: string) => void;
}

export const ClientInfoForm = ({
  clientName,
  clientPhone,
  clientEmail,
  onClientNameChange,
  onClientPhoneChange,
  onClientEmailChange
}: ClientInfoFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="clientName">Nome do Cliente</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => onClientNameChange(e.target.value)}
          placeholder="Nome completo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientPhone">Telefone</Label>
        <Input
          id="clientPhone"
          value={clientPhone}
          onChange={(e) => onClientPhoneChange(e.target.value)}
          placeholder="(11) 99999-9999"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientEmail">Email</Label>
        <Input
          id="clientEmail"
          type="email"
          value={clientEmail}
          onChange={(e) => onClientEmailChange(e.target.value)}
          placeholder="cliente@email.com"
        />
      </div>
    </>
  );
};
