
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
    <Card className="mx-4 sm:mx-0">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Escolha o serviço
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Selecione o serviço que deseja agendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {services.length === 0 ? (
          <p className="text-center py-6 sm:py-8 text-gray-600 text-sm sm:text-base">
            Nenhum serviço disponível no momento
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              onClick={() => onServiceSelect(service.id)}
              className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedService === service.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">{service.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{service.duration} minutos</p>
                </div>
                <div className="text-blue-600 font-semibold text-sm sm:text-base">
                  {service.price}
                </div>
              </div>
            </div>
          ))
        )}
        
        <Button 
          onClick={onNext}
          disabled={!selectedService}
          className="w-full mt-4 sm:mt-6 h-11 sm:h-12 text-sm sm:text-base"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;
