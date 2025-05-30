
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import MedicalRecordCard from "./MedicalRecordCard";

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

interface MedicalRecordsListProps {
  records: MedicalRecord[];
  onViewRecord: (record: MedicalRecord) => void;
  onCreateNew: () => void;
  userPlan: string;
}

const MedicalRecordsList = ({ records, onViewRecord, onCreateNew, userPlan }: MedicalRecordsListProps) => {
  if (records.length > 0) {
    return (
      <div className="space-y-6">
        {records.map((record) => (
          <MedicalRecordCard
            key={record.id}
            record={record}
            onView={onViewRecord}
            userPlan={userPlan}
          />
        ))}
      </div>
    );
  }

  return (
    <Card className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600">
      <CardContent>
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Nenhum prontuário encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-base leading-relaxed">
            Comece criando prontuários médicos para seus pacientes. 
            Organize todas as informações importantes em um só lugar.
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base"
            onClick={onCreateNew}
          >
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeiro Prontuário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsList;
