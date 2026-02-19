import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { usePodcastsStore } from "../../../stores/podcasts";

export default function AdminPodcastsList() {
  const { adminPodcasts, fetchAdminPodcasts, loading, error } = usePodcastsStore();
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "scheduled" | "published">("all");
  useEffect(() => {
    fetchAdminPodcasts({ status: statusFilter });
  }, [statusFilter, fetchAdminPodcasts]);
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Podcasts</h1>
        <Link to="/admin/podcasts/new" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Podcast</Link>
      </div>
      <div className="mb-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600"><Spinner size={18}/> Loading podcasts...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : adminPodcasts.length === 0 ? (
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
              {adminPodcasts.map((p) => (
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
