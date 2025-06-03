
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserPlanSelectProps {
  currentPlan: string;
  onPlanChange: (newPlan: string) => void;
}

const UserPlanSelect = ({ currentPlan, onPlanChange }: UserPlanSelectProps) => {
  const plans = [
    { value: 'free', label: '14 dias teste' },
    { value: 'basico', label: 'Básico' },
    { value: 'profissional', label: 'Profissional' },
    { value: 'premium', label: 'Premium' }
  ];

  return (
    <Select value={currentPlan} onValueChange={onPlanChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {plans.map((plan) => (
          <SelectItem key={plan.value} value={plan.value}>
            {plan.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UserPlanSelect;
