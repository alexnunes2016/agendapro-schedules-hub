
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

const UpgradeHeader = () => {
  return (
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
            <Star className="h-6 w-6 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Upgrade de Plano</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UpgradeHeader;
