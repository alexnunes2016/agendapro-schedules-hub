
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus } from "lucide-react";

interface MedicalRecordsHeaderProps {
  onCreateNew: () => void;
}

const MedicalRecordsHeader = ({ onCreateNew }: MedicalRecordsHeaderProps) => {
  return (
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
            onClick={onCreateNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Prontuário
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MedicalRecordsHeader;
