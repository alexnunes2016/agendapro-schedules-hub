
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, LogOut, Copy, Star, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardHeaderProps {
  profile: any;
  darkMode: boolean;
  toggleDarkMode: () => void;
  handleLogout: () => void;
}

const DashboardHeader = ({ profile, darkMode, toggleDarkMode, handleLogout }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const copyPublicLink = () => {
    const publicLink = `${window.location.origin}/booking/${user?.id}`;
    navigator.clipboard.writeText(publicLink);
    toast({
      title: "Link copiado!",
      description: "Link público de agendamento copiado para a área de transferência",
    });
  };

  const MenuItems = () => (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDarkMode}
        className="text-gray-600 dark:text-gray-300 w-full justify-start"
      >
        {darkMode ? '☀️' : '🌙'}
        <span className="ml-2">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
      </Button>
      
      {profile.plan === 'free' && (
        <Link to="/upgrade" className="w-full">
          <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 w-full justify-start">
            <Star className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        </Link>
      )}
      
      <Button onClick={copyPublicLink} variant="outline" className="w-full justify-start">
        <Copy className="h-4 w-4 mr-2" />
        Copiar Link Público
      </Button>
      
      <Link to="/settings" className="w-full">
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </Link>
      
      <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 w-full justify-start">
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </>
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">AgendoPro</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px] sm:max-w-none">{profile.clinic_name}</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
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
            
            <Button onClick={copyPublicLink} variant="outline">
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

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-6">
                  <MenuItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
