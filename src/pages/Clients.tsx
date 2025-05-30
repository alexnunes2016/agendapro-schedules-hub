
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users, Phone, Mail, Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const { user, loading: authLoading } = useAuth();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      fetchClients();
    }
  }, [user, authLoading]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('appointments')
        .select('client_name, client_phone, client_email, appointment_date, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group appointments by client and get unique clients with their latest info
      const clientsMap = new Map();
      
      data?.forEach((appointment: any) => {
        const clientKey = appointment.client_email || appointment.client_name;
        if (!clientsMap.has(clientKey)) {
          clientsMap.set(clientKey, {
            name: appointment.client_name,
            phone: appointment.client_phone,
            email: appointment.client_email,
            lastVisit: appointment.appointment_date,
            totalAppointments: 1,
            status: 'active'
          });
        } else {
          const existing = clientsMap.get(clientKey);
          existing.totalAppointments++;
          // Update with most recent visit date
          if (new Date(appointment.appointment_date) > new Date(existing.lastVisit)) {
            existing.lastVisit = appointment.appointment_date;
          }
        }
      });

      setClients(Array.from(clientsMap.values()));
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inativo</Badge>
    );
  };

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
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Clientes</h1>
              </div>
            </div>
            
            <Link to="/appointments">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Buscar Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredClients.map((client: any, index: number) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {client.totalAppointments} agendamento{client.totalAppointments !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {getStatusBadge(client.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {client.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Última visita: {new Date(client.lastVisit).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Histórico
                    </Button>
                    <Link to="/appointments">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Agendar
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                {searchTerm ? "Tente ajustar o termo de busca" : "Você ainda não possui clientes cadastrados"}
              </p>
              <Link to="/appointments">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Agendamento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clients;
