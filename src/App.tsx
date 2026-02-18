import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores/auth";
import PublicLayout from "./components/layouts/PublicLayout";
import AdminLayout from "./components/layouts/AdminLayout";
// import SuperAdminLayout from "./components/layouts/SuperAdminLayout";
import LandingPage from "./pages/LandingPage";
import PodcastListPage from "./pages/PodcastListPage";
import PodcastDetailPage from "./pages/PodcastDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
// import UnifiedDashboard from "./pages/admin/UnifiedDashboard";
// import EventManagement from "./pages/admin/EventManagement";
import LiveListenerPage from "./pages/LiveListenerPage";
// import LiveStudio from "./pages/admin/LiveStudio";
import LivePage from "./pages/LivePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import AboutPage from "./pages/AboutPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEventsList from "./pages/admin/events/AdminEventsList";
import AdminEventDetail from "./pages/admin/events/AdminEventDetail";
import AdminEventEdit from "./pages/admin/events/AdminEventEdit";
import AdminEventBookings from "./pages/admin/events/AdminEventBookings";
import AdminPropertiesList from "./pages/admin/properties/AdminPropertiesList";
import AdminPropertyDetail from "./pages/admin/properties/AdminPropertyDetail";
import AdminPropertyEdit from "./pages/admin/properties/AdminPropertyEdit";
import AdminPropertyCreate from "./pages/admin/properties/AdminPropertyCreate";
import AdminPropertyContacts from "./pages/admin/properties/AdminPropertyContacts";
import AdminPodcastsList from "./pages/admin/podcasts/AdminPodcastsList";
import AdminPodcastDetail from "./pages/admin/podcasts/AdminPodcastDetail";
import AdminPodcastEdit from "./pages/admin/podcasts/AdminPodcastEdit";
import AdminLiveList from "./pages/admin/live/AdminLiveList";
import AdminLiveDetail from "./pages/admin/live/AdminLiveDetail";
import AdminLiveEdit from "./pages/admin/live/AdminLiveEdit";

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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Admin Routes (Admin and SuperAdmin) */}
      <Route
        element={
          <ProtectedRoute requireAuth requireAnyRole={["admin", "superadmin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Events */}
        <Route path="/admin/events" element={<AdminEventsList />} />
        <Route path="/admin/events/:id" element={<AdminEventDetail />} />
        <Route path="/admin/events/:id/edit" element={<AdminEventEdit />} />
        <Route path="/admin/events/:id/bookings" element={<AdminEventBookings />} />
        {/* Properties */}
        <Route path="/admin/properties" element={<AdminPropertiesList />} />
        <Route path="/admin/properties/:id" element={<AdminPropertyDetail />} />
        <Route path="/admin/properties/new" element={<AdminPropertyCreate />} />
        <Route path="/admin/properties/:id/edit" element={<AdminPropertyEdit />} />
        <Route path="/admin/properties/:id/contacts" element={<AdminPropertyContacts />} />
        {/* Podcasts */}
        <Route path="/admin/podcasts" element={<AdminPodcastsList />} />
        <Route path="/admin/podcasts/:id" element={<AdminPodcastDetail />} />
        <Route path="/admin/podcasts/:id/edit" element={<AdminPodcastEdit />} />
        {/* Live */}
        <Route path="/admin/live" element={<AdminLiveList />} />
        <Route path="/admin/live/:id" element={<AdminLiveDetail />} />
        <Route path="/admin/live/:id/edit" element={<AdminLiveEdit />} />
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
