import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { MapPin, Building2 } from "lucide-react";
import { Link } from "react-router";

export default function AdminPropertiesList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/properties/admin/list");
        setItems(res.data?.data?.items || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Properties</h1>
        <Link to="/admin/properties/new" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Add Property</Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600"><Spinner size={18}/> Loading properties...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded border bg-white p-6 text-center text-slate-600">No properties yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4 flex items-center gap-2"><Building2 size={14}/> <span className="font-medium">{p.title || p.name}</span></td>
                  <td className="py-3 px-4 text-slate-600 flex items-center gap-2"><MapPin size={14}/> {p.location || p.city || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/properties/${p.id}`} className="px-2 py-1 rounded border hover:bg-slate-50">View</Link>
                      <Link to={`/admin/properties/${p.id}/edit`} className="px-2 py-1 rounded border hover:bg-slate-50">Edit</Link>
                      <Link to={`/admin/properties/${p.id}/contacts`} className="px-2 py-1 rounded border hover:bg-slate-50">Contacts</Link>
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
