import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { UserPlus, CheckCircle } from "lucide-react";
import { useRealtorStore } from "../../stores/realtors";
import Spinner from "../../components/Spinner";

const Input = (props: any) => (
  <input
    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
    {...props}
  />
);

export default function RealtorOnboardingPage() {
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    referralSource: "",
    cidNumber: `CID-${Math.floor(100000 + Math.random() * 900000)}`, // Auto-generate CID for now
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const createRealtor = useRealtorStore.getState().createRealtor;
      await createRealtor(form);
      toast.success("Registration successful!");
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Aboard!</h1>
          <p className="text-slate-600 mb-8">
            Your realtor registration has been received successfully. Your Unique ID is:
            <span className="block text-2xl font-mono font-bold text-blue-700 mt-2">{form.cidNumber}</span>
          </p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="block w-full py-3 px-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
            >
              Sign In to Dashboard
            </Link>
            <Link to="/" className="block text-slate-500 hover:text-slate-800 text-sm font-medium">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <UserPlus className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Realtor Onboarding
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Join our network of professional realtors
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <Input
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <Input
                name="phoneNumber"
                type="tel"
                required
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+234 ..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Location
              </label>
              <Input
                name="location"
                type="text"
                required
                value={form.location}
                onChange={handleChange}
                placeholder="Lagos, Nigeria"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Referral Source (Optional)
              </label>
              <Input
                name="referralSource"
                type="text"
                value={form.referralSource}
                onChange={handleChange}
                placeholder="How did you hear about us?"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-blue-200"
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size={18} /> Processing...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
