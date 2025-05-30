
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MedicalRecordCard from "@/components/medical/MedicalRecordCard";
import CreateMedicalRecordModal from "@/components/medical/CreateMedicalRecordModal";
import ViewMedicalRecordModal from "@/components/medical/ViewMedicalRecordModal";

interface MedicalRecord {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  date_of_birth: string | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const MedicalRecords = () => {
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("agendopro_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchRecords();
  }, [navigate]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os prontuários",
          variant: "destructive",
        });
      } else {
        setRecords(data || []);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar prontuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordCreated = () => {
    fetchRecords();
    setShowCreateModal(false);
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const canAccessMedicalRecords = () => {
    return profile?.service_type === 'medicina' || profile?.service_type === 'odontologia';
  };

  const canCreateRecords = () => {
    return ['basico', 'profissional', 'premium'].includes(profile?.plan || '');
  };

  if (!canAccessMedicalRecords()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="px-6 py-4">
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
          </div>
        </header>

        <div className="p-6">
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Módulo não disponível
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Este módulo está disponível apenas para profissionais da área médica e odontológica
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!canCreateRecords()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="px-6 py-4">
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
          </div>
        </header>

        <div className="p-6">
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Upgrade necessário
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                O módulo de prontuários está disponível a partir do plano Básico
              </p>
              <Link to="/upgrade">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Fazer Upgrade
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Prontuários</h1>
              </div>
            </div>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Prontuário
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando prontuários...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <MedicalRecordCard
                key={record.id}
                record={record}
                onView={handleViewRecord}
                userPlan={profile?.plan || 'free'}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Nenhum prontuário encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Comece criando prontuários para seus pacientes
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Prontuário
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateMedicalRecordModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleRecordCreated}
      />

      {selectedRecord && (
        <ViewMedicalRecordModal
          open={showViewModal}
          onOpenChange={setShowViewModal}
          record={selectedRecord}
          userPlan={profile?.plan || 'free'}
          onUpdate={fetchRecords}
        />
      )}
    </div>
  );
};

export default MedicalRecords;
