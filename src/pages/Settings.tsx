
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings as SettingsIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clinicName: "",
    phone: "",
    address: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("agendopro_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userData);
    setUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      clinicName: user.clinic || "",
      phone: "",
      address: ""
    });
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Atualiza os dados do usuário no localStorage
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      clinic: formData.clinicName
    };
    
    localStorage.setItem("agendopro_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Configurações salvas",
      description: "Suas informações foram atualizadas com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clinicName">Nome da clínica/estabelecimento</Label>
              <Input
                id="clinicName"
                value={formData.clinicName}
                onChange={(e) => handleInputChange("clinicName", e.target.value)}
                placeholder="Nome do seu estabelecimento"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
            </div>
            
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lembretes por Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enviar lembretes de agendamento por email
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {user?.plan === 'free' ? 'Disponível no Pro' : 'Ativar'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lembretes por WhatsApp</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enviar lembretes de agendamento por WhatsApp
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {user?.plan === 'free' ? 'Disponível no Premium' : 'Ativar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-lg capitalize">{user?.plan || 'Free'}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.plan === 'free' ? 'Plano gratuito com limitações' : 'Plano pago ativo'}
                </p>
              </div>
              {user?.plan === 'free' && (
                <Link to="/upgrade">
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Fazer Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
