
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AddClientModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clinic_name: "",
    service_type: "",
    plan: "free"
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gerar uma senha temporária
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      console.log('Tentando criar usuário:', formData);

      // Criar usuário usando signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          data: {
            name: formData.name,
            clinic_name: formData.clinic_name,
            service_type: formData.service_type
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        throw authError;
      }

      console.log('Usuário criado com sucesso:', authData);

      // Se o usuário foi criado, tentar criar o perfil manualmente
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            clinic_name: formData.clinic_name,
            service_type: formData.service_type,
            plan: formData.plan
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          // Não vamos lançar erro aqui pois o trigger pode ter criado o perfil
          console.log('Perfil pode ter sido criado automaticamente pelo trigger');
        }
      }

      toast({
        title: "Cliente adicionado com sucesso",
        description: `Cliente ${formData.name} foi criado. Senha temporária: ${tempPassword}`,
      });

      setFormData({
        name: "",
        email: "",
        clinic_name: "",
        service_type: "",
        plan: "free"
      });
      setOpen(false);
    } catch (error: any) {
      console.error('Erro completo:', error);
      
      let errorMessage = "Tente novamente em alguns instantes";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Este email já está registrado no sistema";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Email inválido";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao adicionar cliente",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinic_name">Nome da Clínica/Empresa</Label>
            <Input
              id="clinic_name"
              value={formData.clinic_name}
              onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_type">Tipo de Serviço</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData({ ...formData, service_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medicina">Medicina</SelectItem>
                <SelectItem value="odontologia">Odontologia</SelectItem>
                <SelectItem value="estetica">Estética</SelectItem>
                <SelectItem value="advocacia">Advocacia</SelectItem>
                <SelectItem value="barbearia">Barbearia</SelectItem>
                <SelectItem value="psicologia">Psicologia</SelectItem>
                <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plano</Label>
            <Select
              value={formData.plan}
              onValueChange={(value) => setFormData({ ...formData, plan: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="basico">Básico</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adicionando..." : "Adicionar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
