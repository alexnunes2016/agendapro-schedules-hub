
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Plus, DollarSign, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchServices();
  }, [user, navigate]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Erro ao carregar serviços",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await (supabase as any)
        .from('services')
        .update({ is_active: false } as any)
        .eq('id', serviceId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Serviço excluído",
        description: "O serviço foi removido com sucesso",
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Erro ao excluir serviço",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div>Carregando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
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
                <Clock className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Serviços</h1>
              </div>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{service.duration_minutes} minutos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>R$ {service.price ? parseFloat(service.price).toFixed(2) : '0,00'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Nenhum serviço cadastrado
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Cadastre seus primeiros serviços para começar a receber agendamentos
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Serviço
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Services;
