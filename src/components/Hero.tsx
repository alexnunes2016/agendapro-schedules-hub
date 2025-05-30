
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
          Sistema de Agendamento
          <span className="text-blue-600"> Profissional</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Para clínicas odontológicas, médicas, estética, advocacia e barbearias.
          Simplifique seus agendamentos com nossa plataforma completa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Começar Gratuitamente
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
            Ver Demonstração
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
