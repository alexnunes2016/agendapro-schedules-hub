
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";

interface MedicalRecordsAccessDeniedProps {
  type: 'unauthenticated' | 'service-restricted' | 'plan-restricted';
}

const MedicalRecordsAccessDenied = ({ type }: MedicalRecordsAccessDeniedProps) => {
  const getContent = () => {
    switch (type) {
      case 'unauthenticated':
        return {
          backTo: "/",
          title: "Acesso restrito",
          description: "Você precisa fazer login para acessar os prontuários",
          actionText: "Fazer Login",
          actionTo: "/login"
        };
      case 'service-restricted':
        return {
          backTo: "/dashboard",
          title: "Módulo não disponível",
          description: "Este módulo está disponível apenas para profissionais da área médica e odontológica",
          actionText: null,
          actionTo: null
        };
      case 'plan-restricted':
        return {
          backTo: "/dashboard",
          title: "Upgrade necessário",
          description: "O módulo de prontuários está disponível a partir do plano Básico",
          actionText: "Fazer Upgrade",
          actionTo: "/upgrade"
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to={content.backTo}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Prontuários</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {content.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              {content.description}
            </p>
            {content.actionText && content.actionTo && (
              <Link to={content.actionTo}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {content.actionText}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalRecordsAccessDenied;
