import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";
import { LogOut, Home, Calendar, Mic2, Building2, FileText, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const Sidebar = (
    <div className="h-full w-72 bg-blue-900 text-white shadow-xl flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <h2 className="text-xl font-bold">Admin</h2>
      </div>
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors">
          <Home size={20} /> Dashboard
        </Link>
        {/* Events */}
        <div className="pt-2 text-xs uppercase text-blue-300 px-4">Events</div>
        <Link to="/admin/events" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors">
          <Calendar size={20} /> Events
        </Link>
        {/* Properties */}
        <div className="pt-2 text-xs uppercase text-blue-300 px-4">Properties</div>
        <Link to="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors">
          <Building2 size={20} /> Properties
        </Link>
        {/* Podcasts */}
        <div className="pt-2 text-xs uppercase text-blue-300 px-4">Podcasts</div>
        <Link to="/admin/podcasts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors">
          <FileText size={20} /> Podcasts
        </Link>
        {/* Live */}
        <div className="pt-2 text-xs uppercase text-blue-300 px-4">Live</div>
        <Link to="/admin/live" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors">
          <Mic2 size={20} /> Live Sessions
        </Link>
      </nav>
      <div className="p-4 border-t border-blue-800">
        <div className="mb-3 text-sm">
          <p className="font-semibold">{user?.display_name || user?.email}</p>
          <p className="text-blue-300 text-xs">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar (mobile) */}
      <div className="md:hidden sticky top-0 z-30 bg-blue-900 text-white flex items-center justify-between px-4 py-3 shadow">
        <button onClick={() => setOpen(true)} className="p-2 rounded hover:bg-blue-800">
          <Menu />
        </button>
        <div className="font-semibold">Admin</div>
        <div />
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:block fixed left-0 top-0 h-full">
        {Sidebar}
      </div>

      {/* Sidebar mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:ml-72">
        <Outlet />
      </div>
    </div>
  );
}
