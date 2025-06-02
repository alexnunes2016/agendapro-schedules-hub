
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Menu } from "lucide-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddClientModal from "@/components/admin/AddClientModal";

const AdminHeader = () => {
  const { isSuperAdmin } = useSuperAdminCheck();
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
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </h1>
            </div>
          </div>
          
          {/* Desktop Add Client Button */}
          {isSuperAdmin && (
            <div className="hidden sm:block">
              <AddClientModal />
            </div>
          )}

          {/* Mobile Menu */}
          {isSuperAdmin && (
            <div className="sm:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-6">
                    <AddClientModal />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
