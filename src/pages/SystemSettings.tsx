
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useAuth } from "@/hooks/useAuth";
import WhatsAppSettings from "@/components/WhatsAppSettings";
import EmailSettingsTab from "@/components/settings/EmailSettingsTab";
import GeneralSettingsTab from "@/components/settings/GeneralSettingsTab";

const SystemSettings = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdminCheck();
  const { loading: authLoading } = useAuth();

  if (authLoading || superAdminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações do Sistema</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="email">Email/SMTP</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <EmailSettingsTab />
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <WhatsAppSettings isGlobal={true} />
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
