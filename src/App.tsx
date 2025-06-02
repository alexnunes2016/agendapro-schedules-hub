
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { withErrorBoundary } from "@/utils/errorHandler";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { PageLoader } from "@/components/ui/loading-spinner";

// Lazy loaded pages for better performance
import { 
  LazyDashboard,
  LazyAppointments,
  LazyServices,
  LazyClients,
  LazyMedicalRecords,
  LazyAdminDashboard,
  LazySystemSettings,
  LazySettings
} from "@/utils/performance";

// Regular imports for essential pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingPublic from "./pages/BookingPublic";
import NotFound from "./pages/NotFound";
import Upgrade from "./pages/Upgrade";
import OrganizationUsers from "./pages/OrganizationUsers";
import CalendarSettings from "./pages/CalendarSettings";
import NotificationSettings from "./pages/NotificationSettings";
import "./App.css";

// Wrap components with error boundaries
const ErrorBoundaryWrapper = withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ErrorFallback
);

function App() {
  return (
    <ErrorBoundaryWrapper>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<PageLoader text="Carregando página..." />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<LazyDashboard />} />
                <Route path="/appointments" element={<LazyAppointments />} />
                <Route path="/booking/:userId" element={<BookingPublic />} />
                <Route path="/services" element={<LazyServices />} />
                <Route path="/settings" element={<LazySettings />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/clients" element={<LazyClients />} />
                <Route path="/admin" element={<LazyAdminDashboard />} />
                <Route path="/medical-records" element={<LazyMedicalRecords />} />
                <Route path="/system-settings" element={<LazySystemSettings />} />
                <Route path="/organization/users" element={<OrganizationUsers />} />
                <Route path="/settings/calendars" element={<CalendarSettings />} />
                <Route path="/settings/notifications" element={<NotificationSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundaryWrapper>
  );
}

export default App;
