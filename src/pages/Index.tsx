
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Settings, Star, Check } from "lucide-react";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const plans = [
    {
      name: "Free",
      price: "R$0",
      period: "para sempre",
      description: "Autônomo",
      features: [
        "1 agenda",
        "50 agendamentos/mês",
        "Suporte básico"
      ],
      checkoutUrl: null,
      isFree: true
    },
    {
      name: "Básico",
      price: "R$49,90",
      period: "por mês",
      description: "Pequenos estabelecimentos",
      features: [
        "3 agendas",
        "Agendamentos ilimitados",
        "Lembretes automáticos"
      ],
      checkoutUrl: "https://pay.kiwify.com.br/dIQXZeM"
    },
    {
      name: "Profissional",
      price: "R$129,90",
      period: "por mês",
      description: "Clínicas com equipe",
      features: [
        "10 agendas",
        "Prontuário digital",
        "Atestados médicos"
      ],
      checkoutUrl: "https://pay.kiwify.com.br/ChhN5ug",
      popular: true
    },
    {
      name: "Premium",
      price: "R$299,90",
      period: "por mês",
      description: "Franchises e clínicas grandes",
      features: [
        "Agendas ilimitadas",
        "Relatórios avançados",
        "Suporte prioritário"
      ],
      checkoutUrl: "https://pay.kiwify.com.br/GasXHJx"
    }
  ];

  const handlePlanSelection = (plan: any) => {
    if (plan.isFree) {
      // Redirecionar para registro gratuito
      window.location.href = '/register';
      return;
    }
    
    if (plan.checkoutUrl) {
      // Redirecionar para o checkout do Kiwify
      window.open(plan.checkoutUrl, '_blank');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AgendoPro</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300"
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
              <Link to="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Cadastrar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
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

        {/* Features */}
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

        {/* Pricing */}
        <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800 rounded-3xl mx-8 mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            Planos e Preços
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${
                plan.popular 
                  ? 'border-2 border-blue-600 shadow-xl transform scale-105' 
                  : 'border-2 border-gray-200 hover:border-blue-600 transition-colors'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">Mais Popular</span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                  <p className="text-sm text-gray-500">{plan.period}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : plan.isFree
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                    } text-white`}
                    onClick={() => handlePlanSelection(plan)}
                  >
                    {plan.isFree ? 'Começar Grátis' : 'Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Pronto para modernizar seus agendamentos?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Comece gratuitamente hoje mesmo e veja a diferença em sua gestão.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg">
              Criar Conta Gratuita
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">AgendoPro</span>
            </div>
            <p className="text-gray-400">
              © 2024 AgendoPro. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
