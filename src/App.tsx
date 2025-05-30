
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import MedicalRecords from "./pages/MedicalRecords";
import Settings from "./pages/Settings";
import SystemSettings from "./pages/SystemSettings";
import Upgrade from "./pages/Upgrade";
import BookingPublic from "./pages/BookingPublic";
import AdminDashboard from "./pages/AdminDashboard";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/services" element={<Services />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/booking/:userId" element={<BookingPublic />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/demo" element={<Demo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
