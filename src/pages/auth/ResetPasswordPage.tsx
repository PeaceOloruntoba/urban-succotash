import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();
  const nav = useNavigate();

  const token = params.get("token");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      toast.success("Password reset. Redirecting to login...");
      setTimeout(() => nav("/login"), 1000);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to reset password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
      {done ? (
        <div>Password reset. Redirecting to login...</div>
      ) : (
        <form className="space-y-3" onSubmit={submit}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
            {loading && <Spinner size={16} />}<span>{loading ? "Resetting..." : "Reset"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
