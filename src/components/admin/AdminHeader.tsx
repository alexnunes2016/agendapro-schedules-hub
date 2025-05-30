
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import AddClientModal from "@/components/admin/AddClientModal";

const AdminHeader = () => {
  const { isSuperAdmin } = useSuperAdminCheck();

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
              <Users className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            </div>
          </div>
          
          {isSuperAdmin && (
            <AddClientModal />
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
