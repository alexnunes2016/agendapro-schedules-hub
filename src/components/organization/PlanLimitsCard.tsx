
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown } from "lucide-react";

interface PlanLimitsCardProps {
  currentPlan: string;
  currentUserCount: number;
}

const PlanLimitsCard = ({ currentPlan, currentUserCount }: PlanLimitsCardProps) => {
  const planLimits = {
    free: { users: 1, name: "14 dias teste" },
    basico: { users: 3, name: "Básico" },
    profissional: { users: 5, name: "Profissional" },
    premium: { users: -1, name: "Premium" } // -1 = ilimitado
  };

  const current = planLimits[currentPlan as keyof typeof planLimits] || planLimits.free;
  const isUnlimited = current.users === -1;
  const isNearLimit = !isUnlimited && currentUserCount >= current.users * 0.8;
  const isAtLimit = !isUnlimited && currentUserCount >= current.users;

  return (
    <Card className={`${isAtLimit ? 'border-red-200 bg-red-50' : isNearLimit ? 'border-yellow-200 bg-yellow-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Limite do Plano</span>
          </span>
          <Badge variant={currentPlan === 'premium' ? 'default' : 'secondary'} className="flex items-center space-x-1">
            {currentPlan === 'premium' && <Crown className="h-3 w-3" />}
            <span>{current.name}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usuários ativos:</span>
            <span className={`font-medium ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}>
              {currentUserCount}{isUnlimited ? '' : ` / ${current.users}`}
            </span>
          </div>
          
          {!isUnlimited && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (currentUserCount / current.users) * 100)}%` }}
              />
            </div>
          )}
          
          {isAtLimit && (
            <p className="text-xs text-red-600 mt-2">
              Limite atingido. Faça upgrade para adicionar mais usuários.
            </p>
          )}
          
          {isNearLimit && !isAtLimit && (
            <p className="text-xs text-yellow-600 mt-2">
              Próximo do limite. Considere fazer upgrade.
            </p>
          )}
          
          {isUnlimited && (
            <p className="text-xs text-green-600 mt-2">
              Usuários ilimitados no plano Premium.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanLimitsCard;
