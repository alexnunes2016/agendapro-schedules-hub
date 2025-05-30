
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Star, Calendar } from "lucide-react";

const Upgrade = () => {
  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "para sempre",
      description: "Ideal para profissionais autônomos",
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
      current: true
    },
    {
      name: "Básico",
      price: "R$ 49,90",
      period: "/mês",
      description: "Para pequenos estabelecimentos",
      features: [
        "2 agendas",
        "Até 200 agendamentos/mês",
        "Lembretes por email",
        "Prontuários básicos",
        "Relatórios simples",
        "Suporte prioritário"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 129,90",
      period: "/mês",
      description: "Para clínicas com equipe",
      features: [
        "5 agendas",
        "Agendamentos ilimitados",
        "Lembretes por email e WhatsApp",
        "Prontuários completos",
        "Relatórios avançados",
        "Integração com calendário",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "R$ 299,90",
      period: "/mês",
      description: "Para franchises e clínicas grandes",
      features: [
        "Agendas ilimitadas",
        "Tudo do plano Profissional",
        "API personalizada",
        "White label",
        "Relatórios personalizados",
        "Gerente de conta dedicado",
        "Suporte 24/7"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Upgrade de Plano</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-800 dark:text-white">AgendoPro</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Escolha o melhor plano para seu negócio
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Desbloqueie todo o potencial do AgendoPro com recursos avançados 
            e suporte especializado para fazer seu negócio crescer.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? 'border-2 border-blue-600 shadow-xl' 
                  : plan.current 
                    ? 'border-2 border-gray-300' 
                    : 'border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Plano Atual
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Limitações:
                    </h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-xs text-gray-500 dark:text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  className={`w-full ${
                    plan.current 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Plano Atual' : 'Escolher Plano'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Perguntas Frequentes
          </h3>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">Posso cancelar a qualquer momento?</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Sim, você pode cancelar sua assinatura a qualquer momento. 
                  Não há taxas de cancelamento.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">Como funciona o período de teste?</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Oferecemos 7 dias gratuitos para testar todos os recursos do plano escolhido.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">Posso fazer upgrade/downgrade do meu plano?</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Sim, você pode alterar seu plano a qualquer momento. 
                  As mudanças entram em vigor no próximo ciclo de cobrança.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
