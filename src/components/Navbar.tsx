import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-blue-900 hover:text-blue-800 transition-colors">
          SafeNest
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/properties" className="text-slate-700 hover:text-blue-800 transition-colors">Properties</Link>
          <Link to="/events" className="text-slate-700 hover:text-blue-800 transition-colors">Events</Link>
          <Link to="/podcasts" className="text-slate-700 hover:text-blue-800 transition-colors">Podcasts</Link>
          <Link to="/live" className="text-slate-700 hover:text-blue-800 transition-colors">Live</Link>
          {user ? (
            <>
              <Link to="/admin" className="text-blue-800 hover:text-blue-900 font-semibold">Dashboard</Link>
              <Link to="/admin/super" className="text-blue-800 hover:text-blue-900 font-semibold">Super Admin</Link>
              <button
                className="btn btn-outline text-sm"
                onClick={() => {
                  logout();
                  nav("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 hover:text-blue-800 transition-colors">Login</Link>
              <Link to="/register" className="btn btn-primary text-sm">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
