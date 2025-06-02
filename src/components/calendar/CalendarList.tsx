
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings, Users, Eye, EyeOff, MoreHorizontal, Trash2, Clock, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCalendars } from "@/hooks/useCalendars";
import { useState } from "react";
import EditCalendarModal from "./EditCalendarModal";
import CalendarScheduleModal from "./CalendarScheduleModal";
import CalendarPermissionsModal from "./CalendarPermissionsModal";

const CalendarList = () => {
  const { calendars, loading, toggleCalendarStatus, deleteCalendar } = useCalendars();
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const handleEdit = (calendar) => {
    setSelectedCalendar(calendar);
    setShowEditModal(true);
  };

  const handleSchedule = (calendar) => {
    setSelectedCalendar(calendar);
    setShowScheduleModal(true);
  };

  const handlePermissions = (calendar) => {
    setSelectedCalendar(calendar);
    setShowPermissionsModal(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Minhas Agendas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando agendas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
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
              <p className="text-sm text-gray-500 mt-2">
                Clique em "Nova Agenda" para criar sua primeira agenda
              </p>
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
                          <DropdownMenuItem onClick={() => handleEdit(calendar)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSchedule(calendar)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Configurar Horários
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePermissions(calendar)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Gerenciar Permissões
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleCalendarStatus(calendar.id, calendar.is_active)}
                          >
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
                          <DropdownMenuItem
                            onClick={() => deleteCalendar(calendar.id, calendar.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deletar
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

      <EditCalendarModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        calendar={selectedCalendar}
      />

      <CalendarScheduleModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        calendar={selectedCalendar}
      />

      <CalendarPermissionsModal
        open={showPermissionsModal}
        onOpenChange={setShowPermissionsModal}
        calendar={selectedCalendar}
      />
    </>
  );
};

export default CalendarList;
