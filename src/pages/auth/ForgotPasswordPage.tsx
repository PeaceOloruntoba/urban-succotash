import { useState } from "react";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("If the email exists, a reset link has been sent");
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to send reset link";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
      {sent ? (
        <div>We sent you a reset link if the email exists.</div>
      ) : (
        <form className="space-y-3" onSubmit={submit}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
            {loading && <Spinner size={16} />}<span>{loading ? "Sending..." : "Send reset link"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
