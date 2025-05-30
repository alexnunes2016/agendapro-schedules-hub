
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Plus, Settings, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CreateCalendarModal from "@/components/calendar/CreateCalendarModal";
import CalendarList from "@/components/calendar/CalendarList";

const CalendarSettings = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Configurações de Agenda
                </h1>
              </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Agenda
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de Agendas */}
          <div className="lg:col-span-2">
            <CalendarList />
          </div>

          {/* Configurações Gerais */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configurações Gerais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Intervalo Padrão</p>
                    <p className="text-sm text-gray-600">Duração padrão dos agendamentos</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>30min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Horário de Funcionamento</p>
                    <p className="text-sm text-gray-600">Segunda a Sexta</p>
                  </div>
                  <span className="text-sm">08:00 - 18:00</span>
                </div>

                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Horários
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Permissões</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Configure quem pode acessar e modificar cada agenda
                </p>
                <Button variant="outline" className="w-full">
                  Gerenciar Permissões
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateCalendarModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default CalendarSettings;
