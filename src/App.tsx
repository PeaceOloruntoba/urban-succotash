import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useAuthStore } from "./stores/auth";
import PublicLayout from "./components/layouts/PublicLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import SuperAdminLayout from "./components/layouts/SuperAdminLayout";
import LandingPage from "./pages/LandingPage";
import PodcastListPage from "./pages/PodcastListPage";
import PodcastDetailPage from "./pages/PodcastDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import EventManagement from "./pages/admin/EventManagement";
import LiveListenerPage from "./pages/LiveListenerPage";
import LiveStudio from "./pages/admin/LiveStudio";
import LivePage from "./pages/LivePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const { loadFromStorage } = useAuthStore();

  useEffect(() => {
    // Load auth state from localStorage on app start
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/podcasts" element={<PodcastListPage />} />
        <Route path="/podcasts/:id" element={<PodcastDetailPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/live/listen" element={<LiveListenerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute requireAuth>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<EventManagement />} />
        <Route path="/admin/events/:id" element={<EventManagement />} />
        <Route path="/admin/live" element={<LiveStudio />} />
      </Route>

      {/* Super Admin Routes */}
      <Route
        element={
          <ProtectedRoute requireAuth requireRole="superadmin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/super" element={<SuperAdminDashboard />} />
        <Route path="/admin/super/users" element={<SuperAdminDashboard />} />
        <Route path="/admin/super/properties" element={<SuperAdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
