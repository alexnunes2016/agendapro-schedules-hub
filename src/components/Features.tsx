
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Settings } from "lucide-react";

const Features = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Funcionalidades Principais
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-l-4 border-l-blue-600 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Calendar className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle className="text-xl">Agendamento Online</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Página pública personalizável para seus clientes agendarem diretamente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle className="text-xl">Multi-Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Gerencie múltiplos profissionais e suas respectivas agendas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <Settings className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle className="text-xl">Prontuário Digital</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Prontuário completo para área médica e odontológica com anexos
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Features;
