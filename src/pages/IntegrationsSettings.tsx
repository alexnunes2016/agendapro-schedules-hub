
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Plug className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você precisa estar logado para acessar as integrações.
          </p>
          <Link to="/login">
            <Button>Fazer Login</Button>
          </Link>
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
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Plug className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Integrações
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* AgendoPro Integration */}
        <AgendoProWebhookSettings />

        {/* WhatsApp Integration */}
        <WhatsAppSettings userId={user.id} />
      </div>
    </div>
  );
};

export default IntegrationsSettings;
