
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import ReportsModule from "@/components/reports/ReportsModule";

const Reports = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <ReportsModule />
      </div>
    </div>
  );
};

export default Reports;
