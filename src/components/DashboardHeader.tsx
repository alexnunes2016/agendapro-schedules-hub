
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, LogOut, Copy, Star, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface DashboardHeaderProps {
  profile: any;
  darkMode: boolean;
  toggleDarkMode: () => void;
  handleLogout: () => void;
}

const DashboardHeader = ({ profile, darkMode, toggleDarkMode, handleLogout }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { toast } = useToast();

  const copyPublicLink = () => {
    const publicLink = `${window.location.origin}/booking/${user?.id}`;
    navigator.clipboard.writeText(publicLink);
    toast({
      title: "Link copiado!",
      description: "Link público de agendamento copiado para a área de transferência",
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AgendoPro</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.clinic_name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
            
            {profile.plan === 'free' && (
              <Link to="/upgrade">
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  <Star className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            
            <Button onClick={copyPublicLink} variant="outline" className="hidden sm:flex">
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link Público
            </Button>
            
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
