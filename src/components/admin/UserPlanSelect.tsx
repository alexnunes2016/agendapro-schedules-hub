
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface UserPlanSelectProps {
  currentPlan: string;
  onPlanChange: (newPlan: string) => void;
}

const UserPlanSelect = ({ currentPlan, onPlanChange }: UserPlanSelectProps) => {
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-500';
      case 'basico': return 'bg-blue-500';
      case 'profissional': return 'bg-green-500';
      case 'premium': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return 'Gratuito';
      case 'basico': return 'Básico';
      case 'profissional': return 'Profissional';
      case 'premium': return 'Premium';
      default: return plan;
    }
  };

  return (
    <Select value={currentPlan} onValueChange={onPlanChange}>
      <SelectTrigger className="w-[140px]">
        <Badge className={`${getPlanBadgeColor(currentPlan)} text-white`}>
          {getPlanLabel(currentPlan)}
        </Badge>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Gratuito</SelectItem>
        <SelectItem value="basico">Básico</SelectItem>
        <SelectItem value="profissional">Profissional</SelectItem>
        <SelectItem value="premium">Premium</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserPlanSelect;
