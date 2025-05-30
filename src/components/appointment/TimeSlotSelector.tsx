
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TimeSlotSelectorProps {
  appointmentDate: string;
  appointmentTime: string;
  availableSlots: string[];
  onTimeSelect: (time: string) => void;
}

export const TimeSlotSelector = ({ 
  appointmentDate, 
  appointmentTime, 
  availableSlots, 
  onTimeSelect 
}: TimeSlotSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="time">Horário</Label>
      {appointmentDate ? (
        <div>
          {availableSlots.length === 0 ? (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Não há horários disponíveis para esta data.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={appointmentTime === slot ? "default" : "outline"}
                  onClick={() => onTimeSelect(slot)}
                  className="text-sm h-10"
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Input
          id="time"
          type="time"
          value={appointmentTime}
          onChange={(e) => onTimeSelect(e.target.value)}
          required
        />
      )}
    </div>
  );
};
