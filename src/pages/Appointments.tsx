
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowLeft, Search, Clock, User, Phone, Mail, Edit, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";

const Appointments = () => {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAppointments();
      fetchServices();
    }
  }, [user, authLoading]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('appointments')
        .select(`
          *,
          services (
            name,
            duration_minutes,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await (supabase as any)
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Agendamento ${status === 'confirmed' ? 'confirmado' : 'cancelado'} com sucesso`,
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesSearch = appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (appointment.services?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Agendamentos</h1>
              </div>
            </div>
            
            <NewAppointmentModal onAppointmentCreated={fetchAppointments} />
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente ou serviço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredAppointments.map((appointment: any) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {appointment.client_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.services?.name || 'Serviço não especificado'}
                        </p>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.appointment_time} ({appointment.services?.duration_minutes || 0}min)</span>
                      </div>
                      {appointment.client_phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.client_phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {appointment.client_email && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{appointment.client_email}</span>
                        </div>
                      </div>
                    )}
                    
                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Observações:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2 lg:items-end">
                    {appointment.services?.price && (
                      <div className="text-lg font-bold text-blue-600">
                        R$ {parseFloat(appointment.services.price).toFixed(2)}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      {appointment.status === "pending" && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-600"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Tente ajustar os filtros de busca" 
                  : "Você ainda não possui agendamentos"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Appointments;
