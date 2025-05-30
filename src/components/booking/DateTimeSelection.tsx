
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  availableSlots: string[];
  onDateChange: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateTimeSelection = ({ 
  selectedDate, 
  selectedTime, 
  availableSlots, 
  onDateChange, 
  onTimeSelect, 
  onNext, 
  onBack 
}: DateTimeSelectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Escolha data e horário
        </CardTitle>
        <CardDescription>
          Selecione quando deseja ser atendido
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1"
          />
        </div>

        {selectedDate && (
          <div>
            <Label>Horários disponíveis</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  onClick={() => onTimeSelect(slot)}
                  className="text-sm"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedDate || !selectedTime}
            className="flex-1"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTimeSelection;
