
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Crown, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PlanLimitsCardProps {
  currentPlan: string;
  currentUserCount: number;
}

const PlanLimitsCard = ({ currentPlan, currentUserCount }: PlanLimitsCardProps) => {
  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'free':
        return { users: 1, calendars: 1, name: '14 dias teste' };
      case 'basico':
        return { users: 3, calendars: 2, name: 'Básico' };
      case 'profissional':
        return { users: 5, calendars: 'Ilimitado', name: 'Profissional' };
      case 'premium':
        return { users: 'Ilimitado', calendars: 'Ilimitado', name: 'Premium' };
      default:
        return { users: 1, calendars: 1, name: '14 dias teste' };
    }
  };

  const limits = getPlanLimits(currentPlan);
  const userPercentage = typeof limits.users === 'number' 
    ? Math.min((currentUserCount / limits.users) * 100, 100)
    : 0;

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'profissional':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'premium':
        return <Star className="h-5 w-5 text-yellow-600" />;
      default:
        return <Users className="h-5 w-5 text-blue-600" />;
    }
  };

  const isNearLimit = typeof limits.users === 'number' && currentUserCount >= limits.users * 0.8;
  const isAtLimit = typeof limits.users === 'number' && currentUserCount >= limits.users;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getPlanIcon(currentPlan)}
            <span>Limites do Plano {limits.name}</span>
          </div>
          {currentPlan === 'free' && (
            <Link to="/upgrade">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Star className="h-4 w-4 mr-2" />
                Fazer Upgrade
              </Button>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usuários */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Usuários</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {currentUserCount} / {typeof limits.users === 'number' ? limits.users : '∞'}
              </span>
              {isAtLimit && (
                <Badge variant="destructive" className="text-xs">
                  Limite atingido
                </Badge>
              )}
              {isNearLimit && !isAtLimit && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                  Próximo ao limite
                </Badge>
              )}
            </div>
          </div>
          {typeof limits.users === 'number' && (
            <Progress 
              value={userPercentage} 
              className={`h-2 ${isAtLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-gray-100'}`}
            />
          )}
        </div>

        {/* Agendas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Agendas</span>
            </div>
            <span className="text-sm text-gray-600">
              0 / {typeof limits.calendars === 'number' ? limits.calendars : '∞'}
            </span>
          </div>
          {typeof limits.calendars === 'number' && (
            <Progress value={0} className="h-2" />
          )}
        </div>

        {/* Mensagem informativa */}
        {currentPlan === 'free' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Plano Gratuito:</strong> Você pode ter apenas 1 usuário (você mesmo). 
              Para adicionar mais usuários à sua organização, faça upgrade para um plano pago.
            </p>
          </div>
        )}

        {isAtLimit && currentPlan !== 'premium' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ <strong>Limite atingido:</strong> Você atingiu o limite de usuários do seu plano. 
              Faça upgrade para adicionar mais usuários.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanLimitsCard;
