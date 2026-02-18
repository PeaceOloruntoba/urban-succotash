import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { useState } from "react";
import { Menu, X, Home, Building2, Calendar, FileText } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const roles: string[] = (user as any)?.roles || ((user as any)?.role ? [(user as any)?.role] : []);
  const isAdmin = roles.includes("admin") || roles.includes("superadmin");

  const NavLinks = (
    <nav className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-sm font-medium">
      <Link to="/" className="md:hidden flex items-center gap-2 text-slate-700 hover:text-blue-800 transition-colors"><Home size={16}/> Home</Link>
      <Link to="/properties" className="flex items-center gap-2 text-slate-700 hover:text-blue-800 transition-colors"><Building2 size={16}/> Properties</Link>
      <Link to="/events" className="flex items-center gap-2 text-slate-700 hover:text-blue-800 transition-colors"><Calendar size={16}/> Events</Link>
      <Link to="/podcasts" className="flex items-center gap-2 text-slate-700 hover:text-blue-800 transition-colors"><FileText size={16}/> Podcasts</Link>
      {user ? (
        <>
          {isAdmin && (
            <Link to="/admin/dashboard" className="text-blue-800 hover:text-blue-900 font-semibold">Dashboard</Link>
          )}
          <button
            className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700"
            onClick={() => { logout(); nav("/"); setOpen(false); }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-slate-700 hover:text-blue-800 transition-colors">Login</Link>
          <Link to="/register" className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Register</Link>
        </>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-blue-900 hover:text-blue-800 transition-colors">
          SafeNest
        </Link>
        {/* Desktop */}
        <div className="hidden md:block">
          {NavLinks}
        </div>
        {/* Mobile */}
        <button className="md:hidden p-2 rounded hover:bg-slate-100" onClick={() => setOpen((v) => !v)} aria-label="Toggle Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3">
            {NavLinks}
          </div>
        </div>
      )}
    </header>
  );
}
