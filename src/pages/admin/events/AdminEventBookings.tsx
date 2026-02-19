import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useEventsStore } from "../../../stores/events";

export default function AdminEventBookings() {
  const { id } = useParams();
  const { eventBookings, fetchEventBookings, loading, error } = useEventsStore();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await fetchEventBookings(id);
    })();
  }, [id, fetchEventBookings]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Event Bookings</h1>
        <Link to={`/admin/events/${id}`} className="text-sm text-blue-700 hover:underline">Back to event</Link>
      </div>
      {loading ? (
        <div className="flex items-center gap-2"><Spinner /> Loading bookings...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : eventBookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-slate-600">No bookings for this event yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4">Attendee</th>
                <th className="text-left py-3 px-4">Ticket Code</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {eventBookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium">{b.attendee_name}<br/><span className="text-xs text-slate-500">{b.attendee_email}</span></td>
                  <td className="py-3 px-4 font-mono text-xs">{b.ticket_code}</td>
                  <td className="py-3 px-4">{b.currency} {b.total_amount}</td>
                  <td className="py-3 px-4 capitalize"><span className={`px-2 py-1 text-xs rounded ${b.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>{b.payment_status}</span></td>
                  <td className="py-3 px-4">{new Date(b.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
