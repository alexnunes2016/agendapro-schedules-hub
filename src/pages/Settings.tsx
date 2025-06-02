
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings as SettingsIcon, Users, Shield, FileText, Calendar, Bell, Palette, Database } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";

const Settings = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdminCheck();

  if (loading || superAdminLoading) {
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

      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Usuários da Organização */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Usuários da Organização</span>
              </CardTitle>
              <CardDescription>
                Gerencie usuários, convites e permissões da sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/organization/users">
                <Button className="w-full">
                  Gerenciar Usuários
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Prontuários Médicos */}
          {(profile?.service_type === 'medicina' || profile?.service_type === 'odontologia') && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Prontuários Médicos</span>
                </CardTitle>
                <CardDescription>
                  Acesse e gerencie prontuários médicos dos pacientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/medical-records">
                  <Button className="w-full">
                    Ver Prontuários
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Agendas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Agendas</span>
              </CardTitle>
              <CardDescription>
                Configure múltiplas agendas e horários de funcionamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/settings/calendars">
                <Button className="w-full">
                  Configurar Agendas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                <span>Notificações</span>
              </CardTitle>
              <CardDescription>
                Configure notificações por email e WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/settings/notifications">
                <Button className="w-full">
                  Configurar Notificações
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Aparência (apenas super admin) */}
          {isSuperAdmin && (
            <Card className="hover:shadow-lg transition-shadow border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  <span>Aparência</span>
                </CardTitle>
                <CardDescription>
                  Personalize cores, logotipo e tema da aplicação (Super Admin)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/appearance-settings">
                  <Button className="w-full" variant="secondary">
                    <Palette className="h-4 w-4 mr-2" />
                    Personalizar Aparência
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Configurações do Sistema (apenas super admin) */}
          {isSuperAdmin && (
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-red-600" />
                  <span>Sistema</span>
                </CardTitle>
                <CardDescription>
                  Configurações avançadas do sistema (Super Admin)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/system-settings">
                  <Button className="w-full" variant="destructive">
                    <Shield className="h-4 w-4 mr-2" />
                    Acessar Sistema
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
