
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";

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
    <Card className="mx-4 sm:mx-0">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Escolha data e horário
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Selecione quando deseja ser atendido
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="date" className="text-sm sm:text-base">Data</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 h-11 sm:h-12 text-sm sm:text-base"
          />
        </div>

        {selectedDate && (
          <div>
            <Label className="text-sm sm:text-base">Horários disponíveis</Label>
            {availableSlots.length === 0 ? (
              <div className="mt-2 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-yellow-800">
                    Não há horários disponíveis para esta data. Por favor, escolha outra data.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    onClick={() => onTimeSelect(slot)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base"
          >
            Voltar
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedDate || !selectedTime || availableSlots.length === 0}
            className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTimeSelection;
