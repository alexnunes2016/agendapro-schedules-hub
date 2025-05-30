
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Settings, LogOut, Plus, Copy, Star, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import RevenueCard from "@/components/RevenueCard";

const Dashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { isAdmin } = useAdminCheck();
  const [appointments, setAppointments] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
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
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

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

      // Count today's appointments
      const { count: todayCountResult } = await (supabase as any)
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('appointment_date', today);

      setTodayCount(todayCountResult || 0);

      // Count week's appointments
      const { count: weekCountResult } = await (supabase as any)
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('appointment_date', weekStart.toISOString().split('T')[0])
        .lte('appointment_date', weekEnd.toISOString().split('T')[0]);

      setWeekCount(weekCountResult || 0);
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

  const copyPublicLink = () => {
    const publicLink = `${window.location.origin}/booking/${user?.id}`;
    navigator.clipboard.writeText(publicLink);
    toast({
      title: "Link copiado!",
      description: "Link público de agendamento copiado para a área de transferência",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'confirmed': { label: 'Confirmado', class: 'bg-green-100 text-green-800' },
      'pending': { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800' },
      'cancelled': { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
      'completed': { label: 'Concluído', class: 'bg-blue-100 text-blue-800' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
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

  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AgendoPro</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{profile.clinic_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              
              <Button onClick={copyPublicLink} variant="outline" className="hidden sm:flex">
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
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Olá, {profile.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aqui está um resumo dos seus agendamentos para hoje ({today})
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Agendamentos Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{todayCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total para hoje
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{weekCount}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total da semana
              </p>
            </CardContent>
          </Card>

          <RevenueCard />

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Plano Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white capitalize">{profile.plan}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {profile.plan === 'free' ? 'Plano gratuito' : 'Plano ativo'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/appointments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Agendamentos</CardTitle>
                <CardDescription>Visualizar e gerenciar agendamentos</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/clients">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Clientes</CardTitle>
                <CardDescription>Lista de clientes e histórico</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/services">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Serviços</CardTitle>
                <CardDescription>Configurar serviços e horários</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {(profile.service_type === 'medicina' || profile.service_type === 'odontologia') && (
            <Link to="/medical-records">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Settings className="h-12 w-12 text-red-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Prontuários</CardTitle>
                  <CardDescription>Prontuários médicos digitais</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximos Agendamentos</CardTitle>
              <Link to="/appointments">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{appointment.client_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.services?.name} - {new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum agendamento próximo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
