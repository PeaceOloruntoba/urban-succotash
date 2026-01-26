import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import Spinner from "../../components/Spinner";
import { DollarSign, Users, Building2, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const StatCard = ({ title, value, icon: Icon, loading }: { title: string; value: string | number; icon: React.ElementType; loading: boolean; }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      {loading ? <Spinner size={24} /> : <p className="text-3xl font-bold">{value}</p>}
    </div>
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
      <Icon size={24} />
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/superadmin/dashboard/stats");
        setStats(res.data?.data?.stats || {});
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recentBookings = stats?.recent_bookings || [];
  const userSignups = stats?.user_signups || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${(stats?.total_revenue || 0).toLocaleString()}`} icon={DollarSign} loading={loading} />
        <StatCard title="Total Properties" value={stats?.total_properties || 0} icon={Building2} loading={loading} />
        <StatCard title="Total Events" value={stats?.total_events || 0} icon={Calendar} loading={loading} />
        <StatCard title="Total Users" value={stats?.total_users || 0} icon={Users} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          {loading ? <div className="flex justify-center items-center h-64"><Spinner /></div> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">User Sign-ups</h2>
          {loading ? <div className="flex justify-center items-center h-64"><Spinner /></div> : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userSignups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Users" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
