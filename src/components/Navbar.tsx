import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  return (
    <header className="border-b sticky top-0 bg-white/80 backdrop-blur z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">
          SafeNest Podcasts
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/podcasts" className="hover:text-blue-600">
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/admin" className="hover:text-blue-600">
                Dashboard
              </Link>
              <button
                className="px-3 py-1 rounded border hover:bg-gray-50"
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
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
