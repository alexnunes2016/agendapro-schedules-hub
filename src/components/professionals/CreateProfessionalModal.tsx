import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface CreateProfessionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProfessionalModal = ({ open, onOpenChange }: CreateProfessionalModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "professional",
    specialization: ""
  });
  const { createProfessional } = useProfessionals();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Obtemos o organization_id do perfil de usuário se disponível
      const { data } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
      
      const organization_id = data?.organization_id;
      
      const success = await createProfessional({
        ...formData,
        user_id: user.id,
        organization_id: organization_id || undefined
      });
      
      if (success) {
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          role: "professional", 
          specialization: "" 
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "professional", label: "Profissional" },
    { value: "assistant", label: "Assistente" },
    { value: "receptionist", label: "Recepcionista" },
    { value: "admin", label: "Administrador" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Profissional</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Dr. João Silva"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="joao@exemplo.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="role">Função</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="specialization">Especialização</Label>
            <Textarea
              id="specialization"
              value={formData.specialization}
              onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
              placeholder="Ex: Cardiologia, Fisioterapia..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Criando..." : "Criar Profissional"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfessionalModal;
