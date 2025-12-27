import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { api } from "../../lib/axios";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [params] = useSearchParams();
  const nav = useNavigate();

  const token = params.get("token");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/auth/reset-password", { token, password });
    setDone(true);
    setTimeout(() => nav("/login"), 1000);
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
          <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Reset
          </button>
        </form>
      )}
    </div>
  );
}
