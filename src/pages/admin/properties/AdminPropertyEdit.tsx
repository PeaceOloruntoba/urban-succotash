import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";

const Input = (props: any) => <input className="w-full border rounded px-3 py-2" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border rounded px-3 py-2" {...props} />;

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/properties/${id}`);
        setForm(res.data?.data || {});
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const promise = id === 'new' ? api.post('/properties', form) : api.patch(`/properties/${id}`, form);
      await promise;
      toast.success(`Property ${id === 'new' ? 'created' : 'updated'} successfully`);
      navigate(`/admin/properties`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Spinner /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">{id === 'new' ? 'Create Property' : 'Edit Property'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div><label className="block text-sm font-medium mb-1">Title</label><Input name="title" value={form.title || ''} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><Textarea name="description" value={form.description || ''} onChange={handleChange} rows={5} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Location</label><Input name="location" value={form.location || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">City</label><Input name="city" value={form.city || ''} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Price</label><Input type="number" name="price" value={form.price || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Bedrooms</label><Input type="number" name="bedrooms" value={form.bedrooms || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Bathrooms</label><Input type="number" name="bathrooms" value={form.bathrooms || ''} onChange={handleChange} /></div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {saving && <Spinner size={16} />} {saving ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
