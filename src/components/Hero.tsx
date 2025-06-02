
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
        Revolucione Seus Agendamentos
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
        O AgendoPro é a solução completa para gestão de agendamentos. 
        Simplifique sua rotina, organize seus clientes e aumente sua produtividade.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link to="/register">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
            Começar Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link to="/demo">
          <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
            <Play className="mr-2 h-5 w-5" />
            Ver Demonstração
          </Button>
        </Link>
      </div>
      
      {/* Imagem/Vídeo do produto */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Dashboard do AgendoPro
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Interface intuitiva e moderna para gestão completa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
