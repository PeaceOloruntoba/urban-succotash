import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-blue-800">
          SafeNest Podcasts
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/podcasts" className="hover:text-blue-700">Explore</Link>
          <Link to="/live" className="hover:text-blue-700">Live</Link>
          {user ? (
            <>
              <Link to="/admin" className="hover:text-blue-700">Dashboard</Link>
              <button
                className="px-3 py-1 rounded border border-blue-700 text-blue-700 hover:bg-blue-50"
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
              <Link to="/login" className="hover:text-blue-700">Login</Link>
              <Link to="/register" className="hover:text-blue-700">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
