import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { Building2, MapPin, DollarSign, Bed, Bath } from "lucide-react";

export default function AdminPropertyDetail() {
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
        const res = await api.get(`/properties/${id}`);
        setItem(res.data?.data || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="p-6 flex items-center gap-2"><Spinner /> Loading property...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!item) {
    return <div className="p-6 text-slate-600">Property not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <Link to={`/admin/properties/${id}/edit`} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Edit Property</Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-slate-600">{item.description}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Building2 size={16} className="text-slate-500"/> <strong>Type:</strong> {item.type}</div>
          <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-500"/> <strong>Location:</strong> {item.location}, {item.city}</div>
          <div className="flex items-center gap-2"><DollarSign size={16} className="text-slate-500"/> <strong>Price:</strong> ${item.price.toLocaleString()}</div>
          <div className="flex items-center gap-2"><Bed size={16} className="text-slate-500"/> <strong>Bedrooms:</strong> {item.bedrooms}</div>
          <div className="flex items-center gap-2"><Bath size={16} className="text-slate-500"/> <strong>Bathrooms:</strong> {item.bathrooms}</div>
        </div>
      </div>
    </div>
  );
}
