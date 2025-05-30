
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Plus, Calendar, User } from "lucide-react";

const MedicalRecords = () => {
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

  // Simulação de prontuários
  const mockRecords = [
    {
      id: 1,
      patientName: "Maria Silva",
      date: "2024-01-15",
      notes: "Paciente apresentou dor no dente 16. Realizada radiografia.",
      diagnosis: "Cárie dentária",
      treatment: "Obturação com resina composta"
    },
    {
      id: 2,
      patientName: "João Santos",
      date: "2024-01-10",
      notes: "Consulta de rotina. Paciente sem queixas.",
      diagnosis: "Saúde bucal normal",
      treatment: "Limpeza dental"
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
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Prontuários</h1>
              </div>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Prontuário
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Records List */}
        <div className="space-y-4">
          {mockRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                        <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {record.patientName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(record.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Anotações:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.notes}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Diagnóstico:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.diagnosis}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Tratamento:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.treatment}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockRecords.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Nenhum prontuário encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Comece criando prontuários para seus pacientes
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Prontuário
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
