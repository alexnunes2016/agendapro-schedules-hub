
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Menu } from "lucide-react";
import { useOrganizationUsers } from "@/hooks/useOrganizationUsers";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CreateUserModal from "@/components/CreateUserModal";
import OrganizationUsersTable from "@/components/organization/OrganizationUsersTable";
import PlanLimitsCard from "@/components/organization/PlanLimitsCard";

const OrganizationUsers = () => {
  const { users, loading } = useOrganizationUsers();
  const { profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log('OrganizationUsers page - Profile:', profile);
  console.log('OrganizationUsers page - Users:', users);
  console.log('OrganizationUsers page - Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (!profile?.organization_id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Organização não encontrada
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            Não foi possível carregar as informações da organização.
          </p>
          <Link to="/settings">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Configurações
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Back Button */}
              <Link to="/settings" className="sm:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              
              {/* Desktop Back Button */}
              <Link to="/settings" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                  <span className="hidden sm:inline">Usuários da Organização</span>
                  <span className="sm:hidden">Usuários</span>
                </h1>
              </div>
            </div>
            
            {/* Desktop Create Button */}
            <div className="hidden sm:block">
              <CreateUserModal />
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
                    <CreateUserModal />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Plan Limits Card */}
        <PlanLimitsCard 
          currentPlan={profile?.plan || 'free'} 
          currentUserCount={users.length}
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Usuários ({users.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <OrganizationUsersTable users={users} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationUsers;
