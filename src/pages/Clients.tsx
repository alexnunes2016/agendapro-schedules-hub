
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users, Phone, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Clients = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("agendopro_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Simulação de clientes
  const mockClients = [
    {
      id: 1,
      name: "Maria Silva",
      phone: "(11) 99999-9999",
      email: "maria@email.com",
      lastVisit: "2024-01-10",
      totalAppointments: 5,
      status: "active"
    },
    {
      id: 2,
      name: "João Santos",
      phone: "(11) 88888-8888",
      email: "joao@email.com",
      lastVisit: "2024-01-08",
      totalAppointments: 3,
      status: "active"
    },
    {
      id: 3,
      name: "Ana Costa",
      phone: "(11) 77777-7777",
      email: "ana@email.com",
      lastVisit: "2023-12-20",
      totalAppointments: 1,
      status: "inactive"
    }
  ];

  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inativo</Badge>
    );
  };

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
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Clientes</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search */}
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

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
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
                          {client.totalAppointments} agendamentos
                        </p>
                      </div>
                      {getStatusBadge(client.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{client.email}</span>
                      </div>
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
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Agendar
                    </Button>
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
              <p className="text-gray-500 dark:text-gray-500">
                {searchTerm ? "Tente ajustar o termo de busca" : "Você ainda não possui clientes cadastrados"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clients;
