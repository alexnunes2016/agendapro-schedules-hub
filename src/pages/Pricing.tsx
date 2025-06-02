
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "por 14 dias",
      description: "Ideal para testar o sistema",
      features: [
        "1 agenda",
        "Até 50 agendamentos/mês",
        "Página pública de agendamento",
        "Suporte por email"
      ],
      limitations: [
        "Sem lembretes automáticos",
        "Sem prontuários",
        "Sem relatórios"
      ],
      buttonText: "Começar Teste",
      buttonVariant: "outline" as const,
      href: "/register"
    },
    {
      name: "Básico",
      price: "R$ 49,90",
      period: "/mês",
      description: "Para pequenos estabelecimentos",
      features: [
        "2 agendas",
        "Até 200 agendamentos/mês",
        "Até 3 usuários",
        "Lembretes por email",
        "Prontuários básicos",
        "Relatórios simples",
        "Suporte por email e WhatsApp"
      ],
      popular: false,
      buttonText: "Escolher Básico",
      buttonVariant: "default" as const,
      href: "/register"
    },
    {
      name: "Profissional",
      price: "R$ 129,90",
      period: "/mês",
      description: "Para profissionais que crescem",
      features: [
        "Agendamentos ilimitados",
        "Até 5 usuários",
        "Lembretes por email",
        "Relatórios básicos",
        "Integração com calendário",
        "Suporte prioritário"
      ],
      popular: true,
      buttonText: "Escolher Profissional",
      buttonVariant: "default" as const,
      href: "/register"
    },
    {
      name: "Premium",
      price: "R$ 299,90",
      period: "/mês",
      description: "Para clínicas e empresas",
      features: [
        "Tudo do Profissional +",
        "Usuários ilimitados",
        "Lembretes por WhatsApp",
        "Relatórios avançados",
        "API personalizada",
        "Suporte 24/7",
        "Consultoria gratuita"
      ],
      popular: false,
      buttonText: "Escolher Premium",
      buttonVariant: "default" as const,
      href: "/register"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Planos e Preços
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio. Todos os planos incluem teste gratuito de 14 dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={plan.href} className="block">
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Precisa de um plano personalizado? Entre em contato conosco.
          </p>
          <Link to="/register">
            <Button variant="outline">
              Falar com Vendas
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
