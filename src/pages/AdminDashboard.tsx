
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <Link to="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <AdminHeader />
      
      <div className="flex-1 p-6">
        <AdminStatsCards adminStats={adminStats} />
        <AdminTabs />
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
