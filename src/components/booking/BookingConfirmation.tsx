
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Service {
  id: number;
  name: string;
  duration: number;
  price: string;
}

interface BookingData {
  service: string;
  date: string;
  time: string;
  clientEmail: string;
}

interface BookingConfirmationProps {
  bookingData: BookingData;
  selectedService: Service | undefined;
  professionalData: {
    name: string;
    clinic: string;
  };
  onNewBooking: () => void;
}

const BookingConfirmation = ({ 
  bookingData, 
  selectedService, 
  professionalData, 
  onNewBooking 
}: BookingConfirmationProps) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-600">
          Agendamento Confirmado!
        </CardTitle>
        <CardDescription>
          Seu agendamento foi realizado com sucesso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-6 rounded-lg text-left">
          <h3 className="font-semibold mb-4">Detalhes do agendamento:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Serviço:</strong> {selectedService?.name}</p>
            <p><strong>Data:</strong> {new Date(bookingData.date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Horário:</strong> {bookingData.time}</p>
            <p><strong>Duração:</strong> {selectedService?.duration} minutos</p>
            <p><strong>Valor:</strong> {selectedService?.price}</p>
            <p><strong>Profissional:</strong> {professionalData.name}</p>
            <p><strong>Local:</strong> {professionalData.clinic}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>Um e-mail de confirmação foi enviado para <strong>{bookingData.clientEmail}</strong></p>
          <p className="mt-2">
            Em caso de dúvidas ou necessidade de reagendamento, entre em contato conosco.
          </p>
        </div>

        <Button onClick={onNewBooking} className="mt-6">
          Fazer novo agendamento
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingConfirmation;
