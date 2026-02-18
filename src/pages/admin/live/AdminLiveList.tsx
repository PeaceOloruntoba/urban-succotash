import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { Mic, Radio, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLiveList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/live/sessions", { params: { limit: 100 } });
        setItems(res.data?.data?.items || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load live sessions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Live Sessions</h1>
        <Link to="/admin/live/new" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Session</Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600"><Spinner size={18}/> Loading sessions...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded border bg-white p-6 text-center text-slate-600">No live sessions yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Scheduled At</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4 flex items-center gap-2"><Mic size={14}/> <span className="font-medium">{s.title}</span></td>
                  <td className="py-3 px-4 capitalize">
                    {s.status === 'live' || s.is_live ? (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                        <Radio size={12} className="animate-pulse" /> Live
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-800">{s.status}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 flex items-center gap-2">
                    <Calendar size={14}/> {s.scheduled_at ? new Date(s.scheduled_at).toLocaleString() : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/live/${s.id}`} className="px-2 py-1 rounded border hover:bg-slate-50">View</Link>
                      <Link to={`/admin/live/${s.id}/edit`} className="px-2 py-1 rounded border hover:bg-slate-50">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
