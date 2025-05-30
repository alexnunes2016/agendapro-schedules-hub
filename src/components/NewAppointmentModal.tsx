
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useAppointmentBooking } from "@/hooks/useAppointmentBooking";
import { ClientInfoForm } from "@/components/appointment/ClientInfoForm";
import { ServiceSelector } from "@/components/appointment/ServiceSelector";
import { TimeSlotSelector } from "@/components/appointment/TimeSlotSelector";

interface NewAppointmentModalProps {
  onAppointmentCreated: () => void;
}

export const NewAppointmentModal = ({ onAppointmentCreated }: NewAppointmentModalProps) => {
  const [open, setOpen] = useState(false);
  
  const {
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    clientEmail,
    setClientEmail,
    serviceId,
    setServiceId,
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
    notes,
    setNotes,
    services,
    loading,
    availableSlots,
    createAppointment,
    resetForm
  } = useAppointmentBooking(open);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppointment(() => {
      setOpen(false);
      onAppointmentCreated();
    });
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
          <ClientInfoForm
            clientName={clientName}
            clientPhone={clientPhone}
            clientEmail={clientEmail}
            onClientNameChange={setClientName}
            onClientPhoneChange={setClientPhone}
            onClientEmailChange={setClientEmail}
          />
          
          <ServiceSelector
            serviceId={serviceId}
            services={services}
            onServiceChange={setServiceId}
          />
          
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
          
          <TimeSlotSelector
            appointmentDate={appointmentDate}
            appointmentTime={appointmentTime}
            availableSlots={availableSlots}
            onTimeSelect={setAppointmentTime}
          />
          
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
            <Button 
              type="submit" 
              disabled={loading || !appointmentDate || !appointmentTime || availableSlots.length === 0}
            >
              {loading ? "Criando..." : "Criar Agendamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
