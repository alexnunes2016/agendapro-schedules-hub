
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CheckCircle, User, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // Simulação de dados do profissional
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
    toast({
      title: "Agendamento realizado com sucesso!",
      description: "Você receberá um e-mail de confirmação em breve.",
    });
    
    setStep(4); // Página de confirmação
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
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>1</span>
                Serviço
              </span>
              <span className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>2</span>
                Data/Hora
              </span>
              <span className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>3</span>
                Dados
              </span>
              <span className={`flex items-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${
                  step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>4</span>
                Confirmação
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Select Service */}
          {step === 1 && (
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
                {professionalData.services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleInputChange("service", service.id.toString())}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.service === service.id.toString()
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
                ))}
                
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.service}
                  className="w-full mt-6"
                >
                  Continuar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Date and Time */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Escolha data e horário
                </CardTitle>
                <CardDescription>
                  Selecione quando deseja ser atendido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {formData.date && (
                  <div>
                    <Label>Horários disponíveis</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {professionalData.availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={formData.time === slot ? "default" : "outline"}
                          onClick={() => handleInputChange("time", slot)}
                          className="text-sm"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Voltar
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    disabled={!formData.date || !formData.time}
                    className="flex-1"
                  >
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Client Information */}
          {step === 3 && (
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Nome completo *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientPhone">Telefone *</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientEmail">E-mail *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Alguma informação adicional..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1">
                      Agendar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
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
                    <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Horário:</strong> {formData.time}</p>
                    <p><strong>Duração:</strong> {selectedService?.duration} minutos</p>
                    <p><strong>Valor:</strong> {selectedService?.price}</p>
                    <p><strong>Local:</strong> {professionalData.clinic}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Um e-mail de confirmação foi enviado para <strong>{formData.clientEmail}</strong></p>
                  <p className="mt-2">
                    Em caso de dúvidas ou necessidade de reagendamento, entre em contato conosco.
                  </p>
                </div>

                <Button 
                  onClick={() => {
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
                  }}
                  className="mt-6"
                >
                  Fazer novo agendamento
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPublic;
