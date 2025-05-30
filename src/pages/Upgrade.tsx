
import UpgradeHeader from "@/components/UpgradeHeader";
import UpgradeHero from "@/components/UpgradeHero";
import PricingCard from "@/components/PricingCard";
import UpgradeFAQ from "@/components/UpgradeFAQ";

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
      current: true,
      checkoutUrl: null
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
      popular: false,
      checkoutUrl: "https://kiwify.com.br/checkout/BASIC_PLAN_ID" // Substitua pelo ID real do produto
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
      popular: true,
      checkoutUrl: "https://kiwify.com.br/checkout/PROFESSIONAL_PLAN_ID" // Substitua pelo ID real do produto
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
      popular: false,
      checkoutUrl: "https://kiwify.com.br/checkout/PREMIUM_PLAN_ID" // Substitua pelo ID real do produto
    }
  ];

  const handlePlanSelection = (plan: any) => {
    if (plan.current || !plan.checkoutUrl) {
      return;
    }
    
    // Redirecionar para o checkout do Kiwify
    window.open(plan.checkoutUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UpgradeHeader />

      <div className="p-6">
        <UpgradeHero />

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard 
              key={index} 
              plan={plan} 
              onPlanSelection={handlePlanSelection} 
            />
          ))}
        </div>

        <UpgradeFAQ />
      </div>
    </div>
  );
};

export default Upgrade;
