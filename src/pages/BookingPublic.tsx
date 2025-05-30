
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BookingProgress from "@/components/booking/BookingProgress";
import ServiceSelection from "@/components/booking/ServiceSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import ClientInfoForm from "@/components/booking/ClientInfoForm";
import BookingConfirmation from "@/components/booking/BookingConfirmation";

const BookingPublic = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: ""
  });

  // Mock data - Em produção, isso viria da API baseado no userId
  const professionalData = {
    id: userId,
    name: "Dr. João Silva",
    clinic: "Clínica Exemplo",
    serviceType: "odontologia",
    logo: "",
    services: [
      { id: 1, name: "Limpeza dental", duration: 60, price: "R$ 120,00" },
      { id: 2, name: "Consulta", duration: 30, price: "R$ 80,00" },
      { id: 3, name: "Obturação", duration: 90, price: "R$ 200,00" },
    ],
    availableSlots: [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de criação do agendamento
    console.log('Dados do agendamento:', formData);
    
    toast({
      title: "Agendamento realizado com sucesso!",
      description: "Você receberá um e-mail de confirmação em breve.",
    });
    
    setStep(4); // Página de confirmação
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      service: "",
      date: "",
      time: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      notes: ""
    });
  };

  const selectedService = professionalData.services.find(s => s.id.toString() === formData.service);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">{professionalData.clinic}</h1>
            </div>
            <p className="text-gray-600">Agendamento com {professionalData.name}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <BookingProgress currentStep={step} totalSteps={4} />

          {/* Step 1: Select Service */}
          {step === 1 && (
            <ServiceSelection
              services={professionalData.services}
              selectedService={formData.service}
              onServiceSelect={(serviceId) => handleInputChange("service", serviceId)}
              onNext={() => setStep(2)}
            />
          )}

          {/* Step 2: Select Date and Time */}
          {step === 2 && (
            <DateTimeSelection
              selectedDate={formData.date}
              selectedTime={formData.time}
              availableSlots={professionalData.availableSlots}
              onDateChange={(date) => handleInputChange("date", date)}
              onTimeSelect={(time) => handleInputChange("time", time)}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {/* Step 3: Client Information */}
          {step === 3 && (
            <ClientInfoForm
              formData={{
                clientName: formData.clientName,
                clientPhone: formData.clientPhone,
                clientEmail: formData.clientEmail,
                notes: formData.notes
              }}
              onFieldChange={handleInputChange}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
            />
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <BookingConfirmation
              bookingData={formData}
              selectedService={selectedService}
              professionalData={professionalData}
              onNewBooking={resetForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPublic;
