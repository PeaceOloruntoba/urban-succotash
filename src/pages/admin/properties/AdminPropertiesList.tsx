import { useEffect, useState } from "react";
import { usePropertiesStore } from "../../../stores/properties";
import Spinner from "../../../components/Spinner";
import { MapPin, Building2, Eye, Pencil, Users, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminPropertiesList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchAdminList = usePropertiesStore.getState().fetchAdminList;
        await fetchAdminList();
        setItems(usePropertiesStore.getState().adminList || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const deleteProperty = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try {
      setDeletingId(id);
      const deleteProperty = usePropertiesStore.getState().deleteProperty;
      await deleteProperty(id);
      setItems(usePropertiesStore.getState().adminList || []);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };
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
        <div className="py-16 flex items-center justify-center">
          <div className="max-w-xl w-full text-center bg-white rounded-2xl border p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-800 mx-auto">
              <Building2 size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">No properties yet</h2>
            <p className="mt-2 text-slate-600">
              Add your first property listing. You can attach images and contacts after creating.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/admin/properties/new" className="px-5 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900">
                Add Property
              </Link>
            </div>
          </div>
        </div>
        ) : (
        <div className="overflow-x-auto bg-white rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4 w-[45%]">Title</th>
                <th className="text-left py-3 px-4 w-[35%]">Location</th>
                <th className="text-left py-3 px-4 w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-slate-500" />
                      <span className="font-medium line-clamp-1">{p.title || p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <MapPin size={14} className="text-slate-500" />
                      <span className="line-clamp-1">{p.address ? `${p.address}, ${p.city}` : (p.city || '-')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/properties/${p.id}`}
                        title="View"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/admin/properties/${p.id}/edit`}
                        title="Edit"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        <Pencil size={16} />
                      </Link>
                      <Link
                        to={`/admin/properties/${p.id}/contacts`}
                        title="Contacts"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        <Users size={16} />
                      </Link>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        disabled={deletingId === p.id}
                        title={deletingId === p.id ? "Deleting..." : "Delete"}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
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
      )}
    </div>
  );
}
