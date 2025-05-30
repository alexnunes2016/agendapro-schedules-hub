
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: string;
}

interface ServiceSelectionProps {
  services: Service[];
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
  onNext: () => void;
}

const ServiceSelection = ({ services, selectedService, onServiceSelect, onNext }: ServiceSelectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Escolha o serviço
        </CardTitle>
        <CardDescription>
          Selecione o serviço que deseja agendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.length === 0 ? (
          <p className="text-center py-8 text-gray-600">
            Nenhum serviço disponível no momento
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              onClick={() => onServiceSelect(service.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedService === service.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.duration} minutos</p>
                </div>
                <div className="text-blue-600 font-semibold">
                  {service.price}
                </div>
              </div>
            </div>
          ))
        )}
        
        <Button 
          onClick={onNext}
          disabled={!selectedService}
          className="w-full mt-6"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;
