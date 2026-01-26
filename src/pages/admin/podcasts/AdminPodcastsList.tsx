import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { FileText } from "lucide-react";
import { Link } from "react-router";

export default function AdminPodcastsList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/podcasts/admin", { params: { status: "all" } });
        setItems(res.data?.data?.items || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load podcasts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Podcasts</h1>
        <Link to="/admin/podcasts/new" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Podcast</Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600"><Spinner size={18}/> Loading podcasts...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded border bg-white p-6 text-center text-slate-600">No podcasts yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4 flex items-center gap-2"><FileText size={14}/> <span className="font-medium">{p.title}</span></td>
                  <td className="py-3 px-4 capitalize">
                    <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-800">{p.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/podcasts/${p.id}`} className="px-2 py-1 rounded border hover:bg-slate-50">View</Link>
                      <Link to={`/admin/podcasts/${p.id}/edit`} className="px-2 py-1 rounded border hover:bg-slate-50">Edit</Link>
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
