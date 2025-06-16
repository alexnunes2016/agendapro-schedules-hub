
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TenantAuthProvider, useTenantAuth } from "@/hooks/useTenantAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import CalendarSettings from "./pages/CalendarSettings";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import BookingPublic from "./pages/BookingPublic";
import Upgrade from "./pages/Upgrade";
import MedicalRecords from "./pages/MedicalRecords";
import NotificationSettings from "./pages/NotificationSettings";
import SuperAdminDashboard from "./components/admin/SuperAdminDashboard";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
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
  const { user, loading, isSuperAdmin } = useTenantAuth();

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
      {/* Public routes - accessible without authentication */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
      <Route path="/booking/:userId" element={<BookingPublic />} />

      {/* Protected routes - require authentication */}
      {user ? (
        <>
          {/* Super Admin Routes */}
          <Route 
            path="/super-admin" 
            element={
              <RoleBasedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </RoleBasedRoute>
            } 
          />
          
          {/* Regular User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/calendar" element={<CalendarSettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route 
            path="/reports" 
            element={
              <RoleBasedRoute allowedRoles={['super_admin', 'tenant_admin']}>
                <Reports />
              </RoleBasedRoute>
            } 
          />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route 
            path="/medical-records" 
            element={
              <RoleBasedRoute requiredPermissions={['medical_records.view']}>
                <MedicalRecords />
              </RoleBasedRoute>
            } 
          />
        </>
      ) : (
        /* Catch-all for unauthenticated users trying to access protected routes */
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      )}
      
      {/* Fallback routes */}
      <Route 
        path="*" 
        element={
          user ? (
            <Navigate 
              to={isSuperAdmin ? "/super-admin" : "/dashboard"} 
              replace 
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
    </Routes>
  );
};

const App = () => {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TenantAuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <div className="min-h-screen">
              <AppRoutes />
              <Toaster />
              <Sonner />
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </TenantAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
