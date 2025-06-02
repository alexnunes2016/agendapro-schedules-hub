
import { FileText } from "lucide-react";

const MedicalRecordsLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <FileText className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-pulse" />
        <p>Carregando prontuários...</p>
      </div>
    </div>
  );
};

export default MedicalRecordsLoading;
