
import { Card, CardContent } from "@/components/ui/card";

const UpgradeFAQ = () => {
  const faqs = [
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento."
    },
    {
      question: "Como funciona o período de teste?",
      answer: "Oferecemos 7 dias gratuitos para testar todos os recursos do plano escolhido."
    },
    {
      question: "Posso fazer upgrade/downgrade do meu plano?",
      answer: "Sim, você pode alterar seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-16">
      <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Perguntas Frequentes
      </h3>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h4 className="font-medium mb-2">{faq.question}</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpgradeFAQ;
