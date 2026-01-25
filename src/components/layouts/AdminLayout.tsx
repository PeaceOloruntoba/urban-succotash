import { Outlet, Link, useNavigate } from "react-router";
import { useAuthStore } from "../../stores/auth";
import { LogOut, Home, Calendar, Mic2, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-blue-900 text-white shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
          <nav className="space-y-2">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Home size={20} />
              Dashboard
            </Link>
            <Link
              to="/admin/events"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Calendar size={20} />
              Events
            </Link>
            <Link
              to="/admin/podcasts"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Mic2 size={20} />
              Podcasts
            </Link>
            <Link
              to="/admin/live"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Mic2 size={20} />
              Live Sessions
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-800">
          <div className="mb-4 text-sm">
            <p className="font-semibold">{user?.display_name || user?.email}</p>
            <p className="text-blue-300 text-xs">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
}
