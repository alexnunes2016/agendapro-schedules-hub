
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Building, Phone, Mail, Calendar, FileText, Stethoscope, Clipboard } from "lucide-react";
import { format } from "date-fns";

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

interface AdminMedicalRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AdminMedicalRecord;
}

const AdminMedicalRecordModal = ({ open, onOpenChange, record }: AdminMedicalRecordModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Prontuário de {record.patient_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Profissional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Informações do Profissional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {record.profiles?.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {record.profiles?.email}
              </div>
              {record.profiles?.clinic_name && (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span><span className="font-medium">Clínica:</span> {record.profiles.clinic_name}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações do Paciente */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Informações do Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Nome:</span>
                <p className="mt-1">{record.patient_name}</p>
              </div>
              
              {record.patient_email && (
                <div>
                  <span className="font-medium text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email:
                  </span>
                  <p className="mt-1">{record.patient_email}</p>
                </div>
              )}
              
              {record.patient_phone && (
                <div>
                  <span className="font-medium text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Telefone:
                  </span>
                  <p className="mt-1">{record.patient_phone}</p>
                </div>
              )}
              
              {record.date_of_birth && (
                <div>
                  <span className="font-medium text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Data de Nascimento:
                  </span>
                  <p className="mt-1">{format(new Date(record.date_of_birth), 'dd/MM/yyyy')}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações Médicas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Stethoscope className="h-4 w-4 mr-2" />
              Informações Médicas
            </h3>
            
            {record.diagnosis && (
              <div className="mb-4">
                <span className="font-medium text-gray-600">Diagnóstico:</span>
                <div className="mt-1">
                  <Badge variant="secondary">{record.diagnosis}</Badge>
                </div>
              </div>
            )}
            
            {record.treatment && (
              <div className="mb-4">
                <span className="font-medium text-gray-600">Tratamento:</span>
                <p className="mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">{record.treatment}</p>
              </div>
            )}
            
            {record.notes && (
              <div>
                <span className="font-medium text-gray-600 flex items-center">
                  <Clipboard className="h-4 w-4 mr-1" />
                  Observações:
                </span>
                <p className="mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">{record.notes}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Metadados */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Informações do Sistema</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">Criado em:</span> {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')}
              </div>
              <div>
                <span className="font-medium">Última atualização:</span> {format(new Date(record.updated_at), 'dd/MM/yyyy HH:mm')}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">ID do Prontuário:</span> {record.id}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminMedicalRecordModal;
