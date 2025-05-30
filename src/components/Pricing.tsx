
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  checkoutUrl: string | null;
  isFree?: boolean;
  popular?: boolean;
}

const Pricing = () => {
  const plans: Plan[] = [
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

  const handlePlanSelection = (plan: Plan) => {
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
  );
};

export default Pricing;
