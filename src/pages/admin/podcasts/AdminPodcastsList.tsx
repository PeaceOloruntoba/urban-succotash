import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { FileText, Eye, Pencil } from "lucide-react";
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
        <div className="py-16 flex items-center justify-center">
          <div className="max-w-xl w-full text-center bg-white rounded-2xl border p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-800 mx-auto">
              <FileText size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">No podcasts yet</h2>
            <p className="mt-2 text-slate-600">
              Create your first podcast episode. You can set schedule and cover image on the edit screen.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/admin/podcasts/new" className="px-5 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900">
                Create Podcast
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4 w-[60%]">Title</th>
                <th className="text-left py-3 px-4 w-[20%]">Status</th>
                <th className="text-left py-3 px-4 w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminPodcasts.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-500" />
                      <span className="font-medium line-clamp-1">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span className={`px-2 py-1 text-xs rounded ${
                      (p.status || '').toLowerCase() === 'published' ? 'bg-green-100 text-green-700' :
                      (p.status || '').toLowerCase() === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/podcasts/${p.id}`}
                        title="View"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/admin/podcasts/${p.id}/edit`}
                        title="Edit"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        <Pencil size={16} />
                      </Link>
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
