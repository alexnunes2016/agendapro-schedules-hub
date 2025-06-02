
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useCalendarSchedules } from "@/hooks/useCalendarSchedules";
import { Calendar } from "@/hooks/useCalendars";

interface CalendarScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendar: Calendar | null;
}

const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

const CalendarScheduleModal = ({ open, onOpenChange, calendar }: CalendarScheduleModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: '',
    start_time: '',
    end_time: ''
  });

  const { schedules, loading: schedulesLoading, createSchedule, deleteSchedule } = useCalendarSchedules(calendar?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendar) return;

    setLoading(true);

    try {
      const success = await createSchedule({
        calendar_id: calendar.id,
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time
      });
      
      if (success) {
        setFormData({ day_of_week: '', start_time: '', end_time: '' });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    await deleteSchedule(scheduleId);
  };

  if (!calendar) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Horários - {calendar.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Formulário para adicionar novo horário */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="day_of_week">Dia da Semana</Label>
                    <Select 
                      value={formData.day_of_week} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="start_time">Hora Início</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_time">Hora Fim</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !formData.day_of_week || !formData.start_time || !formData.end_time}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? "Adicionando..." : "Adicionar Horário"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de horários existentes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Horários Configurados</h3>
            {schedulesLoading ? (
              <div className="text-center py-4">Carregando horários...</div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum horário configurado ainda
              </div>
            ) : (
              <div className="space-y-2">
                {schedules.map((schedule) => {
                  const dayName = daysOfWeek.find(d => d.value === schedule.day_of_week)?.label;
                  return (
                    <div 
                      key={schedule.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{dayName}</span>
                        <span className="text-gray-600">
                          {schedule.start_time} - {schedule.end_time}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarScheduleModal;
