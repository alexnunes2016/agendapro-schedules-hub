
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { useState } from "react";

const Demo = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    "Agendamento online automatizado",
    "Gestão completa de clientes",
    "Lembretes automáticos por email",
    "Relatórios detalhados",
    "Interface intuitiva e responsiva",
    "Múltiplos usuários e agendas"
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            {/* Header da página */}
            <div className="flex items-center space-x-4 mb-8">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                Veja o AgendoPro em Ação
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Descubra como o AgendoPro pode revolucionar a gestão de agendamentos do seu negócio. 
                Assista nossa demonstração completa e veja todas as funcionalidades em funcionamento.
              </p>
            </div>

            {/* Video Section */}
            <div className="max-w-5xl mx-auto mb-16">
              <Card className="overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                    {/* Placeholder para o vídeo - você pode substituir por um iframe do YouTube/Vimeo */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">
                        Demonstração Completa do Sistema
                      </h3>
                      <p className="text-gray-300">
                        Clique para assistir (5 minutos)
                      </p>
                    </div>
                    {/* 
                    Para adicionar um vídeo real, substitua este div por:
                    <iframe 
                      src="https://www.youtube.com/embed/SEU_VIDEO_ID" 
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                    */}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  O que você verá na demonstração
                </h2>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800 dark:text-white">
                      Teste Grátis por 7 Dias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Experimente todas as funcionalidades sem compromisso. 
                      Não é necessário cartão de crédito.
                    </p>
                    <Link to="/register">
                      <Button className="w-full">
                        Começar Teste Grátis
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800 dark:text-white">
                      Precisa de Ajuda?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Nossa equipe está pronta para ajudar você a implementar 
                      o AgendoPro no seu negócio.
                    </p>
                    <Button variant="outline" className="w-full">
                      Falar com Especialista
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-blue-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Pronto para Transformar Seu Negócio?
                </h2>
                <p className="text-xl mb-6 opacity-90">
                  Junte-se a milhares de profissionais que já usam o AgendoPro
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="text-blue-600">
                      Começar Agora - Grátis
                    </Button>
                  </Link>
                  <Link to="/upgrade">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                      Ver Planos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
