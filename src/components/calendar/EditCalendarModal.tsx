
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendars, Calendar } from "@/hooks/useCalendars";

interface EditCalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendar: Calendar | null;
}

const EditCalendarModal = ({ open, onOpenChange, calendar }: EditCalendarModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6"
  });
  const { updateCalendar } = useCalendars();

  useEffect(() => {
    if (calendar) {
      setFormData({
        name: calendar.name,
        description: calendar.description || "",
        color: calendar.color
      });
    }
  }, [calendar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendar) return;
    
    setLoading(true);

    try {
      const success = await updateCalendar(calendar.id, formData);
      
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    { value: "#3B82F6", label: "Azul" },
    { value: "#10B981", label: "Verde" },
    { value: "#F59E0B", label: "Amarelo" },
    { value: "#EF4444", label: "Vermelho" },
    { value: "#8B5CF6", label: "Roxo" },
    { value: "#F97316", label: "Laranja" }
  ];

  if (!calendar) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Agenda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nome da Agenda</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Agenda Principal"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da agenda..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="edit-color">Cor da Agenda</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: formData.color }}
                    />
                    <span>{colors.find(c => c.value === formData.color)?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
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

export default EditCalendarModal;
