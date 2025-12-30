import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../stores/auth";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";

export default function LoginPage() {
  const nav = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await api.post("/auth/login", { email, password });
      const d = r.data?.data || {};
      setTokens(d.accessToken, d.refreshToken);
      setUser(d.user || null);
      toast.success("Logged in successfully");
      nav("/");
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
          {loading && <Spinner size={16} />}<span>{loading ? "Logging in..." : "Login"}</span>
        </button>
      </form>
      <div className="text-sm mt-3 flex justify-between">
        <Link to="/forgot-password" className="text-blue-600">
          Forgot password?
        </Link>
        <Link to="/register" className="text-blue-600">
          Create account
        </Link>
      </div>
    </div>
  );
}
