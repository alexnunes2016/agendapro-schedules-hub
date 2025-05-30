
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceSelectorProps {
  serviceId: string;
  services: any[];
  onServiceChange: (value: string) => void;
}

export const ServiceSelector = ({ serviceId, services, onServiceChange }: ServiceSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="service">Serviço</Label>
      <Select value={serviceId} onValueChange={onServiceChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service: any) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name} - {service.duration_minutes}min
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
