import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import BookingPublic from "./pages/BookingPublic";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Upgrade from "./pages/Upgrade";
import Clients from "./pages/Clients";
import AdminDashboard from "./pages/AdminDashboard";
import MedicalRecords from "./pages/MedicalRecords";
import SystemSettings from "./pages/SystemSettings";
import OrganizationUsers from "./pages/OrganizationUsers";
import CalendarSettings from "./pages/CalendarSettings";
import NotificationSettings from "./pages/NotificationSettings";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/booking/:userId" element={<BookingPublic />} />
            <Route path="/services" element={<Services />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/organization/users" element={<OrganizationUsers />} />
            <Route path="/settings/calendars" element={<CalendarSettings />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
