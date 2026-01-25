import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import { Link } from "react-router";

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

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "properties" | "events" | "podcasts">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get("/superadmin/dashboard/stats"),
        api.get("/superadmin/users"),
      ]);
      setStats(statsRes.data?.data?.stats || null);
      setUsers(usersRes.data?.data?.users || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRoles = async (userId: string, roles: string[]) => {
    try {
      await api.patch(`/superadmin/users/${userId}/roles`, { roles });
      toast.success("User roles updated");
      loadDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update roles");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/superadmin/users/${userId}`);
      toast.success("User deleted");
      loadDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Super Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {(["overview", "users", "properties", "events", "podcasts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
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
            <div className="card">
              <div className="text-sm text-slate-600 mb-1">Total Users</div>
              <div className="text-3xl font-bold text-blue-800">{stats.users}</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-600 mb-1">Properties</div>
              <div className="text-3xl font-bold text-blue-800">{stats.properties}</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-600 mb-1">Events</div>
              <div className="text-3xl font-bold text-blue-800">{stats.events}</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-600 mb-1">Podcasts</div>
              <div className="text-3xl font-bold text-blue-800">{stats.podcasts}</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-600 mb-1">Total Bookings</div>
              <div className="text-3xl font-bold text-blue-800">{stats.bookings}</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-600 mb-1">Revenue</div>
              <div className="text-3xl font-bold text-blue-800">
                ₦{stats.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Roles</th>
                    <th className="text-left py-2 px-4">Verified</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.display_name || "-"}</td>
                      <td className="py-2 px-4">
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
                      <td className="py-2 px-4">
                        {user.is_email_verified ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✗</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
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

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Properties</h2>
              <Link to="/admin/properties/new" className="btn btn-primary">
                Create Property
              </Link>
            </div>
            <p className="text-slate-600">Property management interface coming soon...</p>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Events</h2>
              <Link to="/admin/events/new" className="btn btn-primary">
                Create Event
              </Link>
            </div>
            <p className="text-slate-600">Event management interface coming soon...</p>
          </div>
        )}

        {/* Podcasts Tab */}
        {activeTab === "podcasts" && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Podcasts</h2>
              <Link to="/admin" className="btn btn-primary">
                Manage Podcasts
              </Link>
            </div>
            <p className="text-slate-600">Podcast management available in main admin dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
