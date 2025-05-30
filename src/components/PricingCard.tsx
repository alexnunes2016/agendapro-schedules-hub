
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  current?: boolean;
  popular?: boolean;
  checkoutUrl: string | null;
}

interface PricingCardProps {
  plan: Plan;
  onPlanSelection: (plan: Plan) => void;
}

const PricingCard = ({ plan, onPlanSelection }: PricingCardProps) => {
  return (
    <Card 
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
          onClick={() => onPlanSelection(plan)}
        >
          {plan.current ? 'Plano Atual' : 'Escolher Plano'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
