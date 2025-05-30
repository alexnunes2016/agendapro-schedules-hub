
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
      <div className="space-y-4">
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
          onClick={onCreateNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Prontuário
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsList;
