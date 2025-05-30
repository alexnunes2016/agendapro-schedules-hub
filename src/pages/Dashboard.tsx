
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

const Dashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Only redirect to login if auth is fully loaded and user is definitely not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('Redirecting to login - user not authenticated');
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Only fetch appointments when we have a user and auth is loaded
    if (!authLoading && user) {
      fetchAppointments();
    }
  }, [user, authLoading]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Get recent appointments
      const { data: recentAppointments, error: recentError } = await (supabase as any)
        .from('appointments')
        .select('*, services(name)')
        .eq('user_id', user.id)
        .gte('appointment_date', today)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(3);

      if (!recentError && recentAppointments) {
        setAppointments(recentAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user || !profile) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <DashboardHeader 
        profile={profile}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />

      <div className="p-6">
        <DashboardWelcome profileName={profile.name} />
        <DashboardStatsCards profile={profile} />
        <DashboardQuickActions profile={profile} />
        <DashboardRecentAppointments appointments={appointments} />
      </div>
    </div>
  );
};

export default Dashboard;
