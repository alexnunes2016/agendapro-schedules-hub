
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BookingProgress from "@/components/booking/BookingProgress";
import ServiceSelection from "@/components/booking/ServiceSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import ClientInfoForm from "@/components/booking/ClientInfoForm";
import BookingConfirmation from "@/components/booking/BookingConfirmation";

const BookingPublic = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: ""
  });

  // Carregar dados do profissional e serviços
  useEffect(() => {
    if (userId) {
      fetchProfessionalData();
    }
  }, [userId]);

  const fetchProfessionalData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        toast({
          title: "Erro",
          description: "Profissional não encontrado",
          variant: "destructive",
        });
        return;
      }

      // Buscar serviços do usuário
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('name');

      if (servicesError) {
        console.error('Erro ao buscar serviços:', servicesError);
      }

      // Configurar dados do profissional
      setProfessionalData({
        id: userId,
        name: profile.name || "Profissional",
        clinic: profile.clinic_name || "Clínica",
        serviceType: profile.service_type || "outros",
        logo: "",
        services: services?.map(service => ({
          id: service.id,
          name: service.name,
          duration: service.duration_minutes,
          price: `R$ ${service.price?.toFixed(2)?.replace('.', ',') || '0,00'}`
        })) || [],
        availableSlots: [
          "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
          "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do profissional",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedService = professionalData?.services.find((s: any) => s.id === formData.service);
      
      // Criar agendamento no banco de dados
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          user_id: userId,
          service_id: formData.service,
          client_name: formData.clientName,
          client_phone: formData.clientPhone,
          client_email: formData.clientEmail,
          appointment_date: formData.date,
          appointment_time: formData.time,
          notes: formData.notes,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        toast({
          title: "Erro ao criar agendamento",
          description: "Tente novamente em alguns instantes",
          variant: "destructive",
        });
        return;
      }

      console.log('Agendamento criado:', appointment);
      
      toast({
        title: "Agendamento realizado com sucesso!",
        description: "Você receberá uma confirmação em breve.",
      });
      
      setStep(4); // Página de confirmação
    } catch (error) {
      console.error('Erro no agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar agendamento",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!professionalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profissional não encontrado</h1>
          <p className="text-gray-600">Verifique se o link está correto.</p>
        </div>
      </div>
    );
  }

  if (professionalData.services.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Nenhum serviço disponível</h1>
          <p className="text-gray-600">Este profissional ainda não cadastrou serviços.</p>
        </div>
      </div>
    );
  }

  const selectedService = professionalData.services.find((s: any) => s.id === formData.service);

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
