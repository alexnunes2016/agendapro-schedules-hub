
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plug } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AgendoProWebhookSettings from "@/components/integrations/AgendoProWebhookSettings";
import WhatsAppSettings from "@/components/WhatsAppSettings";

const IntegrationsSettings = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Plug className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            Você precisa estar logado para acessar as integrações.
          </p>
          <Link to="/login">
            <Button className="w-full sm:w-auto">Fazer Login</Button>
          </Link>
        </div>
      </div>
    );
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
              <Plug className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                Integrações
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* AgendoPro Integration */}
        <AgendoProWebhookSettings />

        {/* WhatsApp Integration */}
        <WhatsAppSettings userId={user.id} />
      </div>
    </div>
  );
};

export default IntegrationsSettings;
