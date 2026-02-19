import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type VerificationResult = {
  booking: {
    id: string;
    event_id: string;
    attendee_name: string;
    attendee_email: string;
    ticket_code: string;
    quantity: number;
    total_amount: number;
    currency: string;
    payment_status: string;
  };
  payment: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
  };
};

export default function PaymentCallbackPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
    if (!reference) {
      setError("Missing payment reference");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/events/payment/verify", { params: { reference } });
        const data = res.data?.data;
        setResult(data);
        toast.success("Payment verified");
        setError(null);
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Payment verification failed";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        navigate(`/events/${id}`);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [loading, id, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800"></div>
            <p className="mt-4 text-slate-600">Verifying payment...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <XCircle size={48} className="mx-auto text-red-600" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Payment Failed</h2>
            <p className="mt-2 text-slate-600">{error}</p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link
                to={`/events/${id}`}
                className="px-5 py-3 bg-slate-100 text-slate-800 rounded-xl font-semibold hover:bg-slate-200"
              >
                Back to Event
              </Link>
              <a
                href="mailto:support@safenest.app"
                className="px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
              >
                Contact Support
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-500">You will be redirected shortly.</p>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto text-green-600" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Payment Successful</h2>
            <p className="mt-2 text-slate-600">
              Your booking is confirmed{result?.booking?.ticket_code ? ` · Code: ${result.booking.ticket_code}` : ""}.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link
                to={`/events/${id}`}
                className="px-5 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900"
              >
                Return to Event
              </Link>
              <Link
                to={`/events/${id}`}
                className="px-5 py-3 bg-blue-100 text-blue-800 rounded-xl font-semibold hover:bg-blue-200"
              >
                View Details
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-500">You will be redirected shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
