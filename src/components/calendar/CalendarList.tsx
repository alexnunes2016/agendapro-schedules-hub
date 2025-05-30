
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings, Users, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CalendarList = () => {
  // Mock data - em produção viria do banco
  const calendars = [
    {
      id: "1",
      name: "Agenda Principal",
      description: "Agenda para atendimentos gerais",
      color: "#3B82F6",
      is_active: true,
      appointments_count: 15
    },
    {
      id: "2", 
      name: "Urgências",
      description: "Agenda para casos de urgência",
      color: "#EF4444",
      is_active: true,
      appointments_count: 3
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Minhas Agendas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {calendars.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma agenda criada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {calendars.map((calendar) => (
              <div
                key={calendar.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: calendar.color }}
                    />
                    <div>
                      <h3 className="font-medium">{calendar.name}</h3>
                      {calendar.description && (
                        <p className="text-sm text-gray-600">{calendar.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={calendar.is_active ? "default" : "secondary"}>
                      {calendar.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{calendar.appointments_count}</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Configurar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {calendar.is_active ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarList;
