import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { Calendar, MapPin } from "lucide-react";
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
        <div className="rounded border bg-white p-6 text-center text-slate-600">No events yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Schedule</th>
                <th className="text-left py-3 px-4">Venue</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminEvents.map((ev) => {
                const start = ev.start_date ? new Date(ev.start_date) : null;
                const when = start ? `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "-";
                return (
                  <tr key={ev.id} className="border-t hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium">{ev.title}</td>
                    <td className="py-3 px-4 capitalize">
                      <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-800">{ev.status}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 flex items-center gap-2"><Calendar size={14}/> {when}</td>
                    <td className="py-3 px-4 text-slate-600 flex items-center gap-2"><MapPin size={14}/> {ev.venue_city || ev.venue_type || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/events/${ev.id}`} className="px-2 py-1 rounded border hover:bg-slate-50">View</Link>
                        <Link to={`/admin/events/${ev.id}/edit`} className="px-2 py-1 rounded border hover:bg-slate-50">Edit</Link>
                        <Link to={`/admin/events/${ev.id}/bookings`} className="px-2 py-1 rounded border hover:bg-slate-50">Bookings</Link>
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
