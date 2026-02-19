import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";
import { useEventsStore } from "../../../stores/events";
import { api } from "../../../lib/axios";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Select = (props: any) => <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;

export default function AdminEventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEventDetails, fetchAdminEventById, updateEvent, loading } = useEventsStore();
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === 'new') {
      return;
    }
    (async () => {
      setError(null);
      try {
        const details = await fetchAdminEventById(id);
        setForm(details?.event || {});
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load event");
      }
    })();
  }, [id, fetchAdminEventById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    setCoverPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...form };
      if (payload.start_date) payload.startDate = new Date(payload.start_date).toISOString();
      if (payload.end_date) payload.endDate = new Date(payload.end_date).toISOString();
      if (coverFile) {
        const sigRes = await api.post("/podcasts/upload/signature", { resourceType: "image", folder: "events/covers" });
        const { cloudName, apiKey, timestamp, signature } = sigRes.data?.data || sigRes.data;
        const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();
        formData.set("file", coverFile);
        formData.set("api_key", apiKey);
        formData.set("timestamp", String(timestamp));
        formData.set("signature", signature);
        formData.set("folder", "events/covers");
        const res = await fetch(endpoint, { method: "POST", body: formData });
        if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);
        const json = await res.json();
        payload.coverImageUrl = json.secure_url || json.url;
      }
      await updateEvent(id!, payload);
      toast.success(`Event ${id === 'new' ? 'created' : 'updated'} successfully`);
      navigate(`/admin/events`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Spinner /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">{id === 'new' ? 'Create Event' : 'Edit Event'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Title</label><Input name="title" value={form.title || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Theme</label><Input name="theme" value={form.theme || ''} onChange={handleChange} /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Short Description</label><Textarea name="short_description" value={form.short_description || ''} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><Textarea name="description" value={form.description || ''} onChange={handleChange} rows={5} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Start Date</label><Input type="datetime-local" name="start_date" value={form.start_date ? new Date(form.start_date).toISOString().slice(0, 16) : ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">End Date</label><Input type="datetime-local" name="end_date" value={form.end_date ? new Date(form.end_date).toISOString().slice(0, 16) : ''} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Venue Type</label><Select name="venue_type" value={form.venue_type || ''} onChange={handleChange}><option>physical</option><option>online</option><option>hybrid</option></Select></div>
          <div><label className="block text-sm font-medium mb-1">Status</label><Select name="status" value={form.status || ''} onChange={handleChange}><option>draft</option><option>published</option><option>archived</option></Select></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Venue Address</label><Input name="venue_address" value={form.venue_address || ''} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium mb-1">Online Link</label><Input name="online_link" value={form.online_link || ''} onChange={handleChange} /></div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
          {(coverPreview || currentEventDetails?.event?.cover_image_url) && (
            <img src={coverPreview || currentEventDetails?.event?.cover_image_url} alt="cover" className="mt-2 w-full max-h-48 object-cover rounded" />
          )}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {saving && <Spinner size={16} />} {saving ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
