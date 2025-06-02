
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useAdminStats } from "@/hooks/useAdminStats";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminTabs from "@/components/admin/AdminTabs";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminCheck();
  const { loading: superAdminLoading } = useSuperAdminCheck();
  const navigate = useNavigate();
  const { adminStats } = useAdminStats(isAdmin);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!loading && !isAdmin) {
      navigate("/dashboard");
      return;
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || superAdminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-base sm:text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Acesso Negado
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <Link to="/dashboard">
            <Button className="w-full sm:w-auto">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <AdminHeader />
      
      <div className="flex-1 p-4 sm:p-6">
        <AdminStatsCards adminStats={adminStats} />
        <AdminTabs />
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
