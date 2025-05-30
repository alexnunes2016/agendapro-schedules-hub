
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";

interface AppointmentHeaderProps {
  onAppointmentCreated: () => void;
}

export const AppointmentHeader = ({ onAppointmentCreated }: AppointmentHeaderProps) => {
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
              <Calendar className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Agendamentos</h1>
            </div>
          </div>
          
          <NewAppointmentModal onAppointmentCreated={onAppointmentCreated} />
        </div>
      </div>
    </header>
  );
};
