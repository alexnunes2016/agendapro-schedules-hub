
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Carregando...</p>
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
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Back Button */}
            <Link to="/settings" className="sm:hidden">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            {/* Desktop Back Button */}
            <Link to="/settings" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                <span className="hidden sm:inline">Configurações do Sistema</span>
                <span className="sm:hidden">Config. Sistema</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="general" className="text-xs sm:text-sm py-2">Geral</TabsTrigger>
            <TabsTrigger value="email" className="text-xs sm:text-sm py-2">Email/SMTP</TabsTrigger>
            <TabsTrigger value="whatsapp" className="text-xs sm:text-sm py-2">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 sm:space-y-6">
            <EmailSettingsTab />
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-4 sm:space-y-6">
            <WhatsAppSettings isGlobal={true} />
          </TabsContent>

          <TabsContent value="general" className="space-y-4 sm:space-y-6">
            <GeneralSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
