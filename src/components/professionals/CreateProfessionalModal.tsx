
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfessionals } from "@/hooks/useProfessionals";

interface CreateProfessionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProfessionalModal = ({ open, onOpenChange }: CreateProfessionalModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: ""
  });
  const [loading, setLoading] = useState(false);
  const { createProfessional } = useProfessionals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    try {
      setLoading(true);
      await createProfessional(formData);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: ""
      });
      
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Profissional</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nome do profissional"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div>
            <Label htmlFor="specialization">Especialização</Label>
            <Textarea
              id="specialization"
              value={formData.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
              placeholder="Área de especialização do profissional"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim() || !formData.email.trim()}
            >
              {loading ? "Criando..." : "Criar Profissional"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfessionalModal;
