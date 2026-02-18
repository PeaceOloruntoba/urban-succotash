import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { Mic, Calendar } from "lucide-react";

export default function AdminLiveDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/live/${id}`);
        setItem(res.data?.data?.item || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load session details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="p-6 flex items-center gap-2"><Spinner /> Loading session...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!item) {
    return <div className="p-6 text-slate-600">Session not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <Link to={`/admin/live/${id}/edit`} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Edit Session</Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Mic size={16} className="text-slate-500"/> <strong>Status:</strong> <span className="capitalize px-2 py-1 text-xs rounded bg-slate-100 text-slate-800">{item.status}</span></div>
          <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-500"/> <strong>Scheduled:</strong> {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
