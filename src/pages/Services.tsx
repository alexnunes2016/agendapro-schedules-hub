
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Plus, DollarSign } from "lucide-react";

const Services = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("agendopro_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Simulação de serviços
  const mockServices = [
    {
      id: 1,
      name: "Limpeza dental",
      duration: 60,
      price: "R$ 120,00",
      description: "Limpeza completa dos dentes"
    },
    {
      id: 2,
      name: "Consulta",
      duration: 30,
      price: "R$ 80,00",
      description: "Consulta de rotina"
    },
    {
      id: 3,
      name: "Obturação",
      duration: 90,
      price: "R$ 200,00",
      description: "Restauração dentária"
    }
  ];

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
          {mockServices.map((service) => (
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
                    <span>{service.duration} minutos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{service.price}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockServices.length === 0 && (
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
