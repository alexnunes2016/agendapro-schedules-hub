import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "por 14 dias",
      description: "Ideal para testar o sistema",
      features: [
        "Até 50 agendamentos/mês",
        "1 usuário",
        "Calendário básico",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      popular: false
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
        "Prontuários básicos no perfil médico e odontológico",
        "Relatórios simples",
        "Suporte por email e WhatsApp"
      ],
      buttonText: "Escolher Básico",
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 129,90",
      period: "/mês",
      description: "Para profissionais que crescem",
      features: [
        "Tudo do Básico +",
        "Agendamentos ilimitados",
        "Até 5 usuários",
        "Relatórios avançados",
        "Integração com calendário",
        "Suporte prioritário"
      ],
      buttonText: "Escolher Profissional",
      popular: true
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
      buttonText: "Escolher Premium",
      popular: false
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Planos que crescem com você
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Escolha o plano ideal para suas necessidades
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/register" className="block">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
