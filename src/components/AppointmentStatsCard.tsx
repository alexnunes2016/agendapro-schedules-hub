
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AppointmentStatsCardProps {
  type: 'today' | 'week';
  title: string;
  borderColor: string;
  icon: React.ReactNode;
}

const AppointmentStatsCard = ({ type, title, borderColor, icon }: AppointmentStatsCardProps) => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const fetchAppointmentCount = async (selectedDate: Date) => {
    if (!user) return;

    setLoading(true);
    try {
      let startDate, endDate;
      
      if (type === 'today') {
        startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // Para semana, calcular início e fim da semana da data selecionada
        startDate = new Date(selectedDate);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      }

      const { count: appointmentCount } = await (supabase as any)
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('appointment_date', startDate.toISOString().split('T')[0])
        .lte('appointment_date', endDate.toISOString().split('T')[0]);

      setCount(appointmentCount || 0);
    } catch (error) {
      console.error('Error fetching appointment count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentCount(date);
  }, [date, user]);

  const getDateLabel = () => {
    if (type === 'today') {
      return format(date, "dd/MM/yyyy");
    } else {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return `${format(startOfWeek, "dd/MM")} - ${format(endOfWeek, "dd/MM")}`;
    }
  };

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : <span>Selecionar data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {icon}
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? '...' : count}
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {getDateLabel()}
        </p>
      </CardContent>
    </Card>
  );
};

export default AppointmentStatsCard;
