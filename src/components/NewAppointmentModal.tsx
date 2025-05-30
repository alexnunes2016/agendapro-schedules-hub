
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface NewAppointmentModalProps {
  onAppointmentCreated: () => void;
}

export const NewAppointmentModal = ({ onAppointmentCreated }: NewAppointmentModalProps) => {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchServices();
    }
  }, [open, user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const checkTimeSlotAvailability = async (date: string, time: string) => {
    try {
      const { data: existingAppointment, error } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', user?.id)
        .eq('appointment_date', date)
        .eq('appointment_time', time)
        .in('status', ['confirmed', 'pending'])
        .maybeSingle();

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      return !existingAppointment;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Verificar se o horário está disponível
      const isAvailable = await checkTimeSlotAvailability(appointmentDate, appointmentTime);
      
      if (!isAvailable) {
        toast({
          title: "Horário não disponível",
          description: "Já existe um agendamento para este horário. Por favor, escolha outro horário.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await (supabase as any)
        .from('appointments')
        .insert({
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          service_id: serviceId || null,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          notes,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso",
      });

      // Reset form
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setServiceId("");
      setAppointmentDate("");
      setAppointmentTime("");
      setNotes("");
      setOpen(false);
      onAppointmentCreated();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Telefone</Label>
            <Input
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="cliente@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Serviço</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
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
          
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o agendamento"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Agendamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
