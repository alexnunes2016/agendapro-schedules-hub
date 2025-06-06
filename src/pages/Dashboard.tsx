
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardWelcome from "@/components/DashboardWelcome";
import DashboardStatsCards from "@/components/DashboardStatsCards";
import DashboardQuickActions from "@/components/DashboardQuickActions";
import DashboardRecentAppointments from "@/components/DashboardRecentAppointments";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Appointment {
  id: string;
  client_name: string;
  appointment_date: string;
  appointment_time: string;
  services?: {
    name: string;
  };
}

const Dashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle authentication redirect
  useEffect(() => {
    console.log('Dashboard - authLoading:', authLoading, 'user:', user?.id);
    
    if (!authLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate("/login", { replace: true });
        return;
      }
      setPageLoading(false);
    }
  }, [user, authLoading, navigate]);

  // Fetch appointments only when user is available and authenticated
  useEffect(() => {
    if (user && !authLoading && profile) {
      fetchAppointments();
    }
  }, [user, authLoading, profile]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      console.log('Fetching appointments for user:', user.id);
      const today = new Date().toISOString().split('T')[0];

      const { data: recentAppointments, error } = await supabase
        .from('appointments')
        .select('*, services(name)')
        .eq('user_id', user.id)
        .gte('appointment_date', today)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(3);

      if (!error && recentAppointments) {
        console.log('Appointments fetched:', recentAppointments.length);
        setAppointments(recentAppointments);
      } else if (error) {
        console.error('Error fetching appointments:', error);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await signOut();
      navigate("/", { replace: true });
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erro no logout",
        description: "Erro ao desconectar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Show loading while auth is loading or page is loading
  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <LoadingSpinner size="lg" text="Carregando sistema..." />
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  // Show loading if profile hasn't loaded yet
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <LoadingSpinner size="lg" text="Carregando perfil..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <DashboardHeader 
        profile={profile}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />

      <div className="p-4 sm:p-6">
        <DashboardWelcome profileName={profile.name} />
        <DashboardStatsCards profile={profile} />
        <DashboardQuickActions profile={profile} />
        <DashboardRecentAppointments appointments={appointments} />
      </div>
    </div>
  );
};

export default Dashboard;
