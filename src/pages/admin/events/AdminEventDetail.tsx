import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import { useEventsStore } from "../../../stores/events";
import { Link as RouterLink } from "react-router-dom";

export default function AdminEventDetail() {
  const { id } = useParams();
  const { currentEventDetails, fetchAdminEventById, loading, error, fetchExchangeRates, convertAmount } = useEventsStore();
  const clean = (u?: string) => (u || "").replace(/`/g, "").trim();
  const [displayCurrency, setDisplayCurrency] = useState<string>("USD");

  useEffect(() => {
    if (!id) return;
    (async () => {
      await fetchAdminEventById(id);
      await fetchExchangeRates("NGN");
    })();
  }, [id, fetchAdminEventById, fetchExchangeRates]);

  if (loading) {
    return <div className="p-6 flex items-center gap-2"><Spinner /> Loading event...</div>;
  }
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!currentEventDetails) {
    return <div className="p-6 text-slate-600">Event not found.</div>;
  }

  const details: any = (currentEventDetails as any)?.event ?? currentEventDetails;
  const start = details?.start_date ? new Date(details.start_date) : null;
  const end = details?.end_date ? new Date(details.end_date) : null;
  const when =
    start && end
      ? `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : start
      ? `${start.toLocaleString()}`
      : "-";

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="relative rounded-lg overflow-hidden">
        {details?.cover_image_url && (
          <img src={clean(details.cover_image_url)} alt={details?.title} className="w-full h-44 md:h-60 object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{details?.title}</h1>
            <p className="text-white/80">{details?.theme}</p>
            <div className="mt-2 flex items-center gap-2">
              {details?.featured && <span className="px-2 py-1 text-xs rounded bg-yellow-300 text-yellow-900">Featured</span>}
              {details?.status && <span className="px-2 py-1 text-xs rounded bg-white/80 text-slate-800 capitalize">{details.status}</span>}
              {details?.event_type && <span className="px-2 py-1 text-xs rounded bg-white/80 text-slate-800">{details.event_type}</span>}
              {details?.event_type_new && <span className="px-2 py-1 text-xs rounded bg-white/80 text-slate-800">{details.event_type_new}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/admin/events/${id}/edit`} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Edit Event</Link>
            <RouterLink to={`/admin/events/${id}/images`} className="px-3 py-2 rounded border bg-white/80 hover:bg-white text-sm">Manage Images</RouterLink>
            <RouterLink to={`/admin/events/${id}/tickets`} className="px-3 py-2 rounded border bg-white/80 hover:bg-white text-sm">Manage Tickets</RouterLink>
            <RouterLink to={`/admin/events/${id}/speakers`} className="px-3 py-2 rounded border bg-white/80 hover:bg-white text-sm">Manage Speakers</RouterLink>
            <RouterLink to={`/admin/events/${id}/schedule`} className="px-3 py-2 rounded border bg-white/80 hover:bg-white text-sm">Manage Schedule</RouterLink>
            <RouterLink to={`/admin/events/${id}/coupons/new`} className="px-3 py-2 rounded border bg-white/80 hover:bg-white text-sm">Create Coupon</RouterLink>
            <RouterLink to={`/admin/events/${id}/bookings`} className="px-3 py-2 rounded border bg-white/80 hover:bg-white text-sm">View Bookings</RouterLink>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-slate-700">{details?.short_description}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-500"/> <strong>Date:</strong> {when}</div>
          <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-500"/> <strong>Venue:</strong> {details?.venue_address || details?.venue_type}</div>
          <div className="flex items-center gap-2"><Ticket size={16} className="text-slate-500"/> <strong>Tickets Sold:</strong> {(details?.tickets || []).reduce((acc: number, t: any) => acc + (t.quantity_sold || 0), 0)}</div>
          <div className="flex items-center gap-2"><Users size={16} className="text-slate-500"/> <strong>Timezone:</strong> {details?.timezone || "-"}</div>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded border p-3">
            <div className="text-slate-500">Online Link</div>
            <div className="truncate">{details?.online_link ? <a className="text-blue-700 hover:underline" href={details.online_link} target="_blank" rel="noreferrer">{details.online_link}</a> : "-"}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-slate-500">Images</div>
            <div>{(details?.images || []).length}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-slate-500">Speakers</div>
            <div>{(details?.speakers || []).length}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Images</h2>
        {details?.images && details.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {details.images.map((img: any) => (
              <div key={img.id} className="relative">
                <img src={clean(img.image_url)} alt="event" className="w-full h-28 object-cover rounded" />
                {img.is_thumbnail && <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Thumbnail</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded p-6 text-center text-slate-600">No images added.</div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Tickets</h2>
        <div className="mb-2">
          <label className="text-sm text-slate-600">Display currency:</label>
          <select value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="NGN">NGN</option>
            <option value="ZAR">ZAR</option>
            <option value="GHS">GHS</option>
          </select>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {(details?.tickets || []).map((ticket: any) => (
            <div key={ticket.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
              <div>
                <p className="font-semibold">{ticket.name}</p>
                <p className="text-sm text-slate-500">
                  {ticket.price > 0 ? `${ticket.currency || "NGN"} ${ticket.price}` : "Free"} · {ticket.quantity_sold} / {ticket.quantity_available || "∞"}
                </p>
                {ticket.price > 0 && (
                  <p className="text-xs text-slate-500">
                    {(() => {
                      const amt = Number(ticket.price);
                      const from = ticket.currency || "NGN";
                      const converted = convertAmount ? convertAmount(amt, from, displayCurrency) : null;
                      if (converted === null) return `≈ ${displayCurrency} ...`;
                      return `≈ ${new Intl.NumberFormat(undefined, { style: "currency", currency: displayCurrency }).format(converted)} (${displayCurrency})`;
                    })()}
                  </p>
                )}
              </div>
              <Link to={`/admin/events/${id}/bookings`} className="text-sm text-blue-600 hover:underline">View Bookings</Link>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Speakers</h2>
        {details?.speakers && details.speakers.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {details.speakers.map((s: any) => (
              <div key={s.id} className="p-4 border-b last:border-b-0 flex items-center gap-3">
                {s.image_url && <img src={clean(s.image_url)} alt={s.name} className="w-12 h-12 rounded object-cover" />}
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-slate-600">{s.occupation} {s.company ? `@ ${s.company}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded p-6 text-center text-slate-600">No speakers added.</div>
        )}
      </div>
    </div>
  );
}
