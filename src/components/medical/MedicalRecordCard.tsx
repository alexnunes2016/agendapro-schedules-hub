
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText } from "lucide-react";

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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {record.patient_name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(record.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {record.diagnosis && (
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white text-sm">Diagnóstico:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{record.diagnosis}</p>
                </div>
              )}
              
              {record.treatment && (
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white text-sm">Tratamento:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{record.treatment}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onView(record)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordCard;
