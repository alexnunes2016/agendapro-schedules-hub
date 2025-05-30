
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings as SettingsIcon, Save, Shield, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import WhatsAppSettings from "@/components/WhatsAppSettings";

const Settings = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { isSuperAdmin } = useSuperAdminCheck();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clinicName: "",
    serviceType: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        clinicName: profile.clinic_name || "",
        serviceType: profile.service_type || ""
      });
    }
  }, [user, profile, authLoading, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          name: formData.name,
          clinic_name: formData.clinicName,
          service_type: formData.serviceType,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Configurações salvas",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
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
            
            {isSuperAdmin && (
              <Link to="/system-settings">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Configurações do Sistema
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informações do Perfil
                </CardTitle>
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
                      readOnly
                      className="bg-gray-100 dark:bg-gray-800"
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
                
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Tipo de serviço</Label>
                  <Input
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange("serviceType", e.target.value)}
                    placeholder="Ex: Clínica médica, Salão de beleza, etc."
                  />
                </div>
                
                <Button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Plano Atual</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {profile?.plan || 'Free'}
                      </p>
                    </div>
                    {profile?.plan === 'free' && (
                      <Link to="/upgrade">
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                          Fazer Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>
                  
                  {profile?.role === 'admin' && (
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Função</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Administrador
                          {isSuperAdmin && " (Super Admin)"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notification Settings */}
            <Card>
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
                      {profile?.plan === 'free' ? 'Disponível no Pro' : 'Ativar'}
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
                      {profile?.plan === 'free' ? 'Disponível no Premium' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <WhatsAppSettings userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
