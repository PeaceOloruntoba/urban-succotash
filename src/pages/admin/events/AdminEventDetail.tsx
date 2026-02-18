import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { Calendar, MapPin, Ticket, Users } from "lucide-react";

export default function AdminEventDetail() {
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
        const res = await api.get(`/events/${id}`);
        setItem(res.data?.data || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="p-6 flex items-center gap-2"><Spinner /> Loading event...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!item) {
    return <div className="p-6 text-slate-600">Event not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{item.event?.title}</h1>
        <Link to={`/admin/events/${id}/edit`} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Edit Event</Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-slate-600">{item.event?.short_description}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-500"/> <strong>Date:</strong> {new Date(item.event?.start_date).toLocaleString()}</div>
          <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-500"/> <strong>Venue:</strong> {item.event?.venue_address || item.event?.venue_type}</div>
          <div className="flex items-center gap-2"><Ticket size={16} className="text-slate-500"/> <strong>Tickets Sold:</strong> {item.tickets.reduce((acc: number, t: any) => acc + t.quantity_sold, 0)}</div>
          <div className="flex items-center gap-2"><Users size={16} className="text-slate-500"/> <strong>Status:</strong> <span className="capitalize px-2 py-1 text-xs rounded bg-slate-100 text-slate-800">{item.event?.status}</span></div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Tickets</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {item.tickets.map((ticket: any) => (
            <div key={ticket.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
              <div>
                <p className="font-semibold">{ticket.name}</p>
                <p className="text-sm text-slate-500">{ticket.price > 0 ? `$${ticket.price}` : 'Free'} - {ticket.quantity_sold} / {ticket.quantity_available || '∞'}</p>
              </div>
              <Link to={`/admin/events/${id}/bookings`} className="text-sm text-blue-600 hover:underline">View Bookings</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
