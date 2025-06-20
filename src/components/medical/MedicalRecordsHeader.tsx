
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MedicalRecordsHeaderProps {
  onCreateNew: () => void;
}

const MedicalRecordsHeader = ({ onCreateNew }: MedicalRecordsHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Back Button */}
            <Link to="/dashboard" className="sm:hidden">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            {/* Desktop Back Button */}
            <Link to="/dashboard" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">Prontuários</h1>
            </div>
          </div>
          
          {/* Desktop New Button */}
          <div className="hidden sm:block">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onCreateNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Prontuário
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-6">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 w-full justify-start"
                    onClick={() => {
                      onCreateNew();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Prontuário
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicalRecordsHeader;
