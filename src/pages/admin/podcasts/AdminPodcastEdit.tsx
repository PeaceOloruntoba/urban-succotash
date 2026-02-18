import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";

const Input = (props: any) => <input className="w-full border rounded px-3 py-2" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border rounded px-3 py-2" {...props} />;
const Select = (props: any) => <select className="w-full border rounded px-3 py-2" {...props} />;

export default function AdminPodcastEdit() {
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
        const res = await api.get(`/podcasts/${id}`);
        setForm(res.data?.data || {});
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load podcast");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const promise = id === 'new' ? api.post('/podcasts', form) : api.patch(`/podcasts/${id}`, form);
      await promise;
      toast.success(`Podcast ${id === 'new' ? 'created' : 'updated'} successfully`);
      navigate(`/admin/podcasts`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save podcast");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Spinner /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">{id === 'new' ? 'Create Podcast' : 'Edit Podcast'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div><label className="block text-sm font-medium mb-1">Title</label><Input name="title" value={form.title || ''} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><Textarea name="description" value={form.description || ''} onChange={handleChange} rows={5} /></div>
        <div><label className="block text-sm font-medium mb-1">Status</label><Select name="status" value={form.status || ''} onChange={handleChange}><option>draft</option><option>published</option></Select></div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {saving && <Spinner size={16} />} {saving ? 'Saving...' : 'Save Podcast'}
          </button>
        </div>
      </form>
    </div>
  );
}
