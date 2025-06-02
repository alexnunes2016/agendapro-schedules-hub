
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const RevenueCard = () => {
  const { user } = useAuth();
  const [revenue, setRevenue] = useState(0);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const fetchRevenue = async (selectedDate: Date) => {
    if (!user) return;

    setLoading(true);
    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      // Buscar agendamentos confirmados e concluídos do dia
      const { data: appointments, error } = await (supabase as any)
        .from('appointments')
        .select('*, services(price)')
        .eq('user_id', user.id)
        .gte('appointment_date', startDate.toISOString().split('T')[0])
        .lte('appointment_date', endDate.toISOString().split('T')[0])
        .in('status', ['confirmed', 'completed']);

      if (!error && appointments) {
        const totalRevenue = appointments.reduce((total: number, appointment: any) => {
          return total + (appointment.services?.price || 0);
        }, 0);
        setRevenue(totalRevenue);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue(date);
  }, [date, user]);

  return (
    <Card className="border-l-4 border-l-green-600">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Valor Recebido
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
          <DollarSign className="h-5 w-5 text-green-600" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? '...' : `R$ ${revenue.toFixed(2)}`}
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {format(date, "dd/MM/yyyy")}
        </p>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;
