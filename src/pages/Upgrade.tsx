
import { useAuth } from "@/hooks/useAuth";
import UpgradeHeader from "@/components/UpgradeHeader";
import UpgradeHero from "@/components/UpgradeHero";
import PricingCard from "@/components/PricingCard";
import UpgradeFAQ from "@/components/UpgradeFAQ";

const Upgrade = () => {
  const { user, profile } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "por 7 dias",
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
      current: profile?.plan === 'free',
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
        "Prontuários básicos no perfil médico e odontológico",
        "Relatórios simples",
        "Suporte por email e WhatsApp"
      ],
      popular: false,
      current: profile?.plan === 'basico',
      checkoutUrl: "https://pay.kiwify.com.br/dIQXZeM"
    },
    {
      name: "Profissional",
      price: "R$ 129,90",
      period: "/mês",
      description: "Para profissionais que crescem",
      features: [
        "Agendamentos ilimitados",
        "Até 3 usuários",
        "Lembretes por email",
        "Relatórios básicos",
        "Integração com calendário",
        "Suporte prioritário"
      ],
      popular: true,
      current: profile?.plan === 'profissional',
      checkoutUrl: "https://pay.kiwify.com.br/ChhN5ug"
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
      current: profile?.plan === 'premium',
      checkoutUrl: "https://pay.kiwify.com.br/GasXHJx"
    }
  ];

  const handlePlanSelection = (plan: any) => {
    if (plan.current || !plan.checkoutUrl) {
      return;
    }
    
    // Construir URL com email do usuário
    const email = user?.email || profile?.email;
    const userId = user?.id;
    
    let checkoutUrl = plan.checkoutUrl;
    
    if (email) {
      checkoutUrl += `?email=${encodeURIComponent(email)}`;
      if (userId) {
        checkoutUrl += `&user_id=${encodeURIComponent(userId)}`;
      }
    }
    
    // Redirecionar para o checkout do Kiwify
    window.open(checkoutUrl, '_blank');
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
