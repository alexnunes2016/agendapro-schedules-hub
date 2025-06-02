
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
      <Label htmlFor="service" className="text-sm font-medium">Serviço</Label>
      <Select value={serviceId} onValueChange={onServiceChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service: any) => (
            <SelectItem key={service.id} value={service.id}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium">{service.name}</span>
                <span className="text-sm text-gray-500">- {service.duration_minutes}min</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
