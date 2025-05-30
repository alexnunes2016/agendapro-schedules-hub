
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateMedicalRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateMedicalRecordModal = ({ open, onOpenChange, onSuccess }: CreateMedicalRecordModalProps) => {
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    date_of_birth: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('medical_records')
        .insert([{
          ...formData,
          date_of_birth: formData.date_of_birth || null,
          patient_email: formData.patient_email || null,
          patient_phone: formData.patient_phone || null,
          diagnosis: formData.diagnosis || null,
          treatment: formData.treatment || null,
          notes: formData.notes || null,
        }]);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar o prontuário",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Prontuário criado com sucesso",
        });
        setFormData({
          patient_name: "",
          patient_email: "",
          patient_phone: "",
          date_of_birth: "",
          diagnosis: "",
          treatment: "",
          notes: "",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar prontuário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Prontuário</DialogTitle>
          <DialogDescription>
            Crie um novo prontuário médico para o paciente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient_name">Nome do Paciente *</Label>
            <Input
              id="patient_name"
              value={formData.patient_name}
              onChange={(e) => handleChange("patient_name", e.target.value)}
              placeholder="Nome completo do paciente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_email">Email</Label>
            <Input
              id="patient_email"
              type="email"
              value={formData.patient_email}
              onChange={(e) => handleChange("patient_email", e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_phone">Telefone</Label>
            <Input
              id="patient_phone"
              value={formData.patient_phone}
              onChange={(e) => handleChange("patient_phone", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Data de Nascimento</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleChange("diagnosis", e.target.value)}
              placeholder="Diagnóstico médico"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Tratamento</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => handleChange("treatment", e.target.value)}
              placeholder="Plano de tratamento"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Anotações adicionais"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Criando..." : "Criar Prontuário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMedicalRecordModal;
