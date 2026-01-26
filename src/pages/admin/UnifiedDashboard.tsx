import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import { Link } from "react-router";
import { useAuthStore } from "../../stores/auth";
import {
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Building2,
  Mic2,
  Radio,
  Plus,
  Download,
} from "lucide-react";

type Stats = {
  users: number;
  properties: number;
  events: number;
  podcasts: number;
  bookings: number;
  revenue: number;
};

type User = {
  id: string;
  email: string;
  display_name: string | null;
  is_email_verified: boolean;
  created_at: string;
  roles: string[];
};

type Event = {
  id: string;
  title: string;
  status: string;
  featured: boolean;
  start_date: string;
  created_at: string;
};

type Property = {
  id: string;
  title: string;
  status: string;
  price: number;
  currency: string;
  created_at: string;
};

type Podcast = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

type LiveSession = {
  id: string;
  title: string;
  status: string;
  is_live: boolean;
  scheduled_start: string | null;
  scheduled_at?: string | null;
};

type Booking = {
  id: string;
  event_id: string;
  attendee_name: string;
  attendee_email: string;
  quantity: number;
  total_amount: number;
  currency: string;
  payment_status: string;
  paystack_reference: string | null;
  payment_date: string | null;
  ticket_code: string | null;
  created_at: string;
};

export default function UnifiedDashboard() {
  const { user } = useAuthStore();
  const isSuperAdmin = (user as any)?.role === "superadmin" || (user as any)?.roles?.includes("superadmin");
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "properties" | "podcasts" | "live" | "users" | "revenue">("overview");
  const [loading, setLoading] = useState(true);
  
  // Lists
  const [events, setEvents] = useState<Event[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventBookings, setEventBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === "events") loadEvents();
    if (activeTab === "properties") loadProperties();
    if (activeTab === "podcasts") loadPodcasts();
    if (activeTab === "live") loadLiveSessions();
    if (activeTab === "users" && isSuperAdmin) loadUsers();
    if (activeTab === "revenue") loadBookings();
  }, [activeTab, isSuperAdmin]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get("/superadmin/dashboard/stats");
      setStats(statsRes.data?.data?.stats || null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await api.get("/events/admin/list");
      setEvents(res.data?.data?.items || []);
    } catch (err: any) {
      toast.error("Failed to load events");
    }
  };

  const loadProperties = async () => {
    try {
      const res = await api.get("/properties/admin/list");
      setProperties(res.data?.data?.items || []);
    } catch (err: any) {
      toast.error("Failed to load properties");
    }
  };

  const loadPodcasts = async () => {
    try {
      const res = await api.get("/podcasts/admin", { params: { status: "all" } });
      setPodcasts(res.data?.data?.items || []);
    } catch (err: any) {
      toast.error("Failed to load podcasts");
    }
  };

  const loadLiveSessions = async () => {
    try {
      const res = await api.get("/live/sessions", { params: { limit: 100 } });
      setLiveSessions(res.data?.data?.items || []);
    } catch (err: any) {
      toast.error("Failed to load live sessions");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/superadmin/users");
      setUsers(res.data?.data?.users || []);
    } catch (err: any) {
      toast.error("Failed to load users");
    }
  };

  const loadBookings = async () => {
    try {
      const res = await api.get("/events/admin/bookings");
      setBookings(res.data?.data?.bookings || []);
    } catch (err: any) {
      toast.error("Failed to load bookings");
    }
  };

  const loadEventBookings = async (eventId: string) => {
    try {
      const res = await api.get(`/events/${eventId}/bookings`);
      setEventBookings(res.data?.data?.bookings || []);
      setSelectedEvent(eventId);
    } catch (err: any) {
      toast.error("Failed to load event bookings");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      loadEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete event");
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success("Property deleted");
      loadProperties();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete property");
    }
  };

  const deletePodcast = async (id: string) => {
    if (!confirm("Are you sure you want to delete this podcast?")) return;
    try {
      await api.delete(`/podcasts/${id}`);
      toast.success("Podcast deleted");
      loadPodcasts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete podcast");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/superadmin/users/${userId}`);
      toast.success("User deleted");
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const updateUserRoles = async (userId: string, roles: string[]) => {
    try {
      await api.patch(`/superadmin/users/${userId}/roles`, { roles });
      toast.success("User roles updated");
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update roles");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {isSuperAdmin ? "Super Admin" : "Admin"} Dashboard
          </h1>
          <p className="text-slate-600">Manage your platform content and users</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
          {(["overview", "events", "properties", "podcasts", "live", ...(isSuperAdmin ? ["users", "revenue"] as const : [])] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-blue-800 border-b-2 border-blue-800"
                  : "text-slate-600 hover:text-blue-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Total Users</div>
                <Users className="text-blue-800" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-800">{stats.users}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Properties</div>
                <Building2 className="text-blue-800" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-800">{stats.properties}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Events</div>
                <Calendar className="text-blue-800" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-800">{stats.events}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Podcasts</div>
                <Mic2 className="text-blue-800" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-800">{stats.podcasts}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Total Bookings</div>
                <Calendar className="text-blue-800" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-800">{stats.bookings}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600">Revenue</div>
                <DollarSign className="text-blue-800" size={20} />
              </div>
              <div className="text-3xl font-bold text-blue-800">
                ₦{stats.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Events</h2>
              <Link to="/admin/events" className="btn btn-primary flex items-center gap-2">
                <Plus size={18} />
                Create Event
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold">{event.title}</div>
                        {event.featured && (
                          <span className="text-xs text-blue-800 bg-blue-100 px-2 py-0.5 rounded">Featured</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded capitalize ${
                          event.status === "published" ? "bg-green-100 text-green-800" :
                          event.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                          "bg-slate-100 text-slate-800"
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(event.start_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/events/${event.id}`}
                            className="p-2 text-blue-800 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/admin/events/${event.id}`}
                            className="p-2 text-blue-800 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => loadEventBookings(event.id)}
                            className="p-2 text-green-800 hover:bg-green-50 rounded"
                            title="View Attendees"
                          >
                            <Users size={16} />
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedEvent && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Event Attendees</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Close
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3">Name</th>
                        <th className="text-left py-2 px-3">Email</th>
                        <th className="text-left py-2 px-3">Quantity</th>
                        <th className="text-left py-2 px-3">Amount</th>
                        <th className="text-left py-2 px-3">Payment Status</th>
                        <th className="text-left py-2 px-3">Ticket Code</th>
                        <th className="text-left py-2 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100">
                          <td className="py-2 px-3">{booking.attendee_name}</td>
                          <td className="py-2 px-3">{booking.attendee_email}</td>
                          <td className="py-2 px-3">{booking.quantity}</td>
                          <td className="py-2 px-3">
                            {booking.currency} {booking.total_amount.toLocaleString()}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              booking.payment_status === "paid" ? "bg-green-100 text-green-800" :
                              booking.payment_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {booking.payment_status}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-xs">{booking.ticket_code}</td>
                          <td className="py-2 px-3 text-xs">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Properties</h2>
              {isSuperAdmin && (
                <Link to="/admin/properties/new" className="btn btn-primary flex items-center gap-2">
                  <Plus size={18} />
                  Create Property
                </Link>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{property.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded capitalize ${
                          property.status === "available" ? "bg-green-100 text-green-800" :
                          "bg-slate-100 text-slate-800"
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {property.currency} {property.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/properties/${property.id}`}
                            className="p-2 text-blue-800 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => deleteProperty(property.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Podcasts Tab */}
        {activeTab === "podcasts" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Podcasts</h2>
              <Link to="/admin" className="btn btn-primary flex items-center gap-2">
                <Plus size={18} />
                Create Podcast
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {podcasts.map((podcast) => (
                    <tr key={podcast.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{podcast.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded capitalize ${
                          podcast.status === "published" ? "bg-green-100 text-green-800" :
                          "bg-slate-100 text-slate-800"
                        }`}>
                          {podcast.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(podcast.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/podcasts/${podcast.id}`}
                            className="p-2 text-blue-800 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => deletePodcast(podcast.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Sessions Tab */}
        {activeTab === "live" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Live Sessions</h2>
              <Link to="/admin/live" className="btn btn-primary flex items-center gap-2">
                <Plus size={18} />
                Create Session
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Scheduled</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {liveSessions.map((session) => (
                    <tr key={session.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{session.title}</td>
                      <td className="py-3 px-4">
                        {session.status === "live" || session.is_live ? (
                          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                            <Radio size={12} className="animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-800 capitalize">
                            {session.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {(session.scheduled_at || session.scheduled_start)
                          ? new Date(session.scheduled_at || session.scheduled_start || "").toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/live`}
                          className="p-2 text-blue-800 hover:bg-blue-50 rounded"
                          title="Manage"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab (SuperAdmin only) */}
        {activeTab === "users" && isSuperAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Roles</th>
                    <th className="text-left py-3 px-4">Verified</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.display_name || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.is_email_verified ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✗</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const newRoles = prompt("Enter roles (comma-separated):", user.roles.join(", "));
                            if (newRoles) {
                              updateUserRoles(
                                user.id,
                                newRoles.split(",").map((r) => r.trim())
                              );
                            }
                          }}
                          className="text-blue-800 hover:underline mr-2"
                        >
                          Edit Roles
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Revenue & Payments</h2>
              <button
                onClick={() => {
                  const csv = [
                    ["Date", "Name", "Email", "Event", "Quantity", "Amount", "Currency", "Payment Status", "Reference", "Ticket Code"].join(","),
                    ...bookings.map(b => [
                      new Date(b.created_at).toLocaleDateString(),
                      b.attendee_name,
                      b.attendee_email,
                      b.event_id,
                      b.quantity,
                      b.total_amount,
                      b.currency,
                      b.payment_status,
                      b.paystack_reference || "",
                      b.ticket_code || ""
                    ].join(","))
                  ].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `revenue-${new Date().toISOString().split("T")[0]}.csv`;
                  a.click();
                }}
                className="btn btn-outline flex items-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Attendee</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Quantity</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Reference</th>
                    <th className="text-left py-3 px-4">Ticket Code</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        {new Date(booking.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">{booking.attendee_name}</td>
                      <td className="py-3 px-4">{booking.attendee_email}</td>
                      <td className="py-3 px-4">{booking.quantity}</td>
                      <td className="py-3 px-4 font-semibold">
                        {booking.currency} {booking.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          booking.payment_status === "paid" ? "bg-green-100 text-green-800" :
                          booking.payment_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {booking.paystack_reference || "-"}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {booking.ticket_code || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
