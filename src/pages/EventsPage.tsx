import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../lib/axios";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  event_type: string;
  start_date: string;
  end_date: string;
  venue_type: string;
  venue_address: string | null;
  venue_city: string | null;
  venue_state: string | null;
  online_platform: string | null;
  online_link: string | null;
  status: string;
  featured: boolean;
  created_at: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      setEvents(res.data?.data?.items || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Upcoming Events</h1>
          <p className="text-slate-600">Discover conferences, webinars, and workshops</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="card card-hover"
              >
                {event.featured && (
                  <span className="inline-block mb-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                    Featured
                  </span>
                )}
                {event.cover_image_url ? (
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-slate-400">No Image</span>
                  </div>
                )}
                <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                {event.short_description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {event.short_description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-800 rounded">
                    {event.venue_type}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                    {event.event_type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
