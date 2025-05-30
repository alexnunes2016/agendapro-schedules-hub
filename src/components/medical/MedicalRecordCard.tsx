
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, Phone, Mail } from "lucide-react";

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

interface MedicalRecordCardProps {
  record: MedicalRecord;
  onView: (record: MedicalRecord) => void;
  userPlan: string;
}

const MedicalRecordCard = ({ record, onView, userPlan }: MedicalRecordCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {record.patient_name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em {new Date(record.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {record.patient_email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{record.patient_email}</span>
                </div>
              )}
              
              {record.patient_phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>{record.patient_phone}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {record.diagnosis && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Diagnóstico:</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{record.diagnosis}</p>
                </div>
              )}
              
              {record.treatment && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Tratamento:</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{record.treatment}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto"
              onClick={() => onView(record)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordCard;
