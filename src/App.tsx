
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import CalendarSettings from "./pages/CalendarSettings";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import OrganizationUsers from "./pages/OrganizationUsers";
import BookingPublic from "./pages/BookingPublic";
import Upgrade from "./pages/Upgrade";
import MedicalRecords from "./pages/MedicalRecords";
import NotificationSettings from "./pages/NotificationSettings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { user, loading } = useAuth();

  console.log('AppRoutes - user:', user?.id || 'No user', 'loading:', loading);

  if (loading) {
    console.log('AppRoutes - showing loading spinner');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Inicializando sistema..." />
      </div>
    );
  }

  console.log('AppRoutes - rendering routes, user authenticated:', !!user);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/booking/:userId" element={<BookingPublic />} />

      {user ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/calendar" element={<CalendarSettings />} />
          <Route path="/settings/organization-users" element={<OrganizationUsers />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

const App = () => {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <div className="min-h-screen">
              <AppRoutes />
              <Toaster />
              <Sonner />
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
