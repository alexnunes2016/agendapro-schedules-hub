
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Plus, Settings, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CreateCalendarModal from "@/components/calendar/CreateCalendarModal";
import CalendarList from "@/components/calendar/CalendarList";
import CreateProfessionalModal from "@/components/professionals/CreateProfessionalModal";
import ProfessionalsList from "@/components/professionals/ProfessionalsList";

const CalendarSettings = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateProfessionalModal, setShowCreateProfessionalModal] = useState(false);
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você precisa estar logado para acessar as configurações de agenda.
          </p>
          <Link to="/login">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <div className="flex space-x-2">
              <Button onClick={() => setShowCreateProfessionalModal(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Novo Profissional
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Agenda
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de Agendas */}
          <div className="lg:col-span-2 space-y-6">
            <CalendarList />
            <ProfessionalsList />
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
                  Configurar Horários Globais
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Estatísticas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de Agendas:</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profissionais Ativos:</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Agendamentos do Mês:</span>
                  <span className="font-medium">-</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateCalendarModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      <CreateProfessionalModal
        open={showCreateProfessionalModal}
        onOpenChange={setShowCreateProfessionalModal}
      />
    </div>
  );
};

export default CalendarSettings;
