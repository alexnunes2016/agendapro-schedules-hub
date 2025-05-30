
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, FileText, User, Building } from "lucide-react";
import { useAdminMedicalRecords } from "@/hooks/useAdminMedicalRecords";
import { format } from "date-fns";
import AdminMedicalRecordModal from "./AdminMedicalRecordModal";

interface AdminMedicalRecord {
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
  user_id: string;
  profiles: {
    name: string;
    email: string;
    clinic_name: string | null;
  };
}

const AdminMedicalRecordsTable = () => {
  const { records, loading } = useAdminMedicalRecords();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AdminMedicalRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredRecords = records.filter((record) =>
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.profiles?.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRecord = (record: AdminMedicalRecord) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Prontuários Médicos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando prontuários...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Prontuários Médicos ({records.length})</span>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por paciente, profissional, clínica ou diagnóstico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                {searchTerm ? 'Nenhum prontuário encontrado' : 'Nenhum prontuário cadastrado'}
              </p>
              <p className="text-sm">
                {searchTerm ? 'Tente ajustar os termos da busca.' : 'Os prontuários aparecerão aqui quando forem criados.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{record.patient_name}</h3>
                        {record.diagnosis && (
                          <Badge variant="secondary">{record.diagnosis}</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Profissional: {record.profiles?.name}</span>
                        </div>
                        {record.profiles?.clinic_name && (
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>Clínica: {record.profiles.clinic_name}</span>
                          </div>
                        )}
                        <div>
                          <span>Criado em: {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                        <div>
                          <span>Atualizado: {format(new Date(record.updated_at), 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                      </div>

                      {record.patient_email && (
                        <div className="mt-2 text-sm text-gray-600">
                          Email: {record.patient_email}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRecord(record)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRecord && (
        <AdminMedicalRecordModal
          open={showModal}
          onOpenChange={setShowModal}
          record={selectedRecord}
        />
      )}
    </>
  );
};

export default AdminMedicalRecordsTable;
