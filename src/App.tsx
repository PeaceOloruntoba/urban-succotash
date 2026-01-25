import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
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

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/super" element={<SuperAdminDashboard />} />
            <Route path="/admin/events" element={<EventManagement />} />
            <Route path="/admin/events/:id" element={<EventManagement />} />
            <Route path="/admin/live" element={<LiveStudio />} />
          </Routes>
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
      </div>
    </BrowserRouter>
  );
}
