
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { useOrganizationUsers } from "@/hooks/useOrganizationUsers";
import { useAuth } from "@/hooks/useAuth";
import CreateUserModal from "@/components/CreateUserModal";
import OrganizationUsersTable from "@/components/organization/OrganizationUsersTable";
import PlanLimitsCard from "@/components/organization/PlanLimitsCard";

const OrganizationUsers = () => {
  const { users, loading } = useOrganizationUsers();
  const { profile } = useAuth();

  console.log('OrganizationUsers page - Profile:', profile);
  console.log('OrganizationUsers page - Users:', users);
  console.log('OrganizationUsers page - Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (!profile?.organization_id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Organização não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Não foi possível carregar as informações da organização.
          </p>
          <Link to="/settings">
            <Button variant="outline">
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
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Usuários da Organização
                </h1>
              </div>
            </div>
            <CreateUserModal />
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Plan Limits Card */}
        <PlanLimitsCard 
          currentPlan={profile?.plan || 'free'} 
          currentUserCount={users.length}
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationUsersTable users={users} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationUsers;
