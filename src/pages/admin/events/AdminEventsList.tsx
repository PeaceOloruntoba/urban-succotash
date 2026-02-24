import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { Calendar, MapPin, Eye, Pencil, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useEventsStore } from "../../../stores/events";

export default function AdminEventsList() {
  const { adminEvents, fetchAdminEvents, loading, error } = useEventsStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchAdminEvents({ status: statusFilter === "all" ? undefined : statusFilter });
  }, [statusFilter, fetchAdminEvents]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Events</h1>
        <Link to="/admin/events/new" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Create Event</Link>
      </div>
      <div className="mb-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600"><Spinner size={18}/> Loading events...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : adminEvents.length === 0 ? (
        <div className="py-16 flex items-center justify-center">
          <div className="max-w-xl w-full text-center bg-white rounded-2xl border p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-800 mx-auto">
              <Calendar size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">No events yet</h2>
            <p className="mt-2 text-slate-600">
              Create your first event to get started. You can add tickets, speakers, and images after creating.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/admin/events/new" className="px-5 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900">
                Create Event
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4 w-[28%]">Title</th>
                <th className="text-left py-3 px-4 w-[12%]">Status</th>
                <th className="text-left py-3 px-4 w-[25%]">Schedule</th>
                <th className="text-left py-3 px-4 w-[20%]">Venue</th>
                <th className="text-left py-3 px-4 w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminEvents.map((ev) => {
                const start = ev.start_date ? new Date(ev.start_date) : null;
                const when = start ? `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "-";
                const status = (ev.status || "").toLowerCase();
                const statusClass =
                  status === "published"
                    ? "bg-green-100 text-green-700"
                    : status === "archived"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-700";
                return (
                  <tr key={ev.id} className="border-t hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium">
                      <div className="line-clamp-1">{ev.title}</div>
                    </td>
                    <td className="py-3 px-4 capitalize">
                      <span className={`px-2 py-1 text-xs rounded ${statusClass}`}>{ev.status}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Calendar size={14} className="text-slate-500" />
                        <span className="line-clamp-1">{when}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <MapPin size={14} className="text-slate-500" />
                        <span className="line-clamp-1">{ev.venue_city || ev.venue_type || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/events/${ev.id}`}
                          title="View"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/events/${ev.id}/edit`}
                          title="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100"
                        >
                          <Pencil size={16} />
                        </Link>
                        <Link
                          to={`/admin/events/${ev.id}/schedule`}
                          title="Schedule"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100"
                        >
                          <Calendar size={16} />
                        </Link>
                        <Link
                          to={`/admin/events/${ev.id}/bookings`}
                          title="Bookings"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100"
                        >
                          <Ticket size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
