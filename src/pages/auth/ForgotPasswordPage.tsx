import { useState } from "react";
import { api } from "../../lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    setSent(true);
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
          <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Send reset link
          </button>
        </form>
      )}
    </div>
  );
}
