import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";
import { useEventsStore } from "../../../stores/events";
import { api } from "../../../lib/axios";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Select = (props: any) => <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Label = ({ children }: { children: any }) => <label className="block text-sm font-medium mb-1">{children}</label>;

export default function AdminEventCreate() {
  const navigate = useNavigate();
  const { createEvent, loading } = useEventsStore();
  const [form, setForm] = useState<any>({
    title: "",
    theme: "",
    shortDescription: "",
    description: "",
    startDate: "",
    endDate: "",
    venueType: "physical",
    venueAddress: "",
    venueCity: "",
    venueState: "",
    onlineLink: "",
    status: "draft",
    featured: false,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    setCoverPreview(f ? URL.createObjectURL(f) : null);
  };

  const uploadCoverIfAny = async (): Promise<string | undefined> => {
    if (!coverFile) return undefined;
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
    return json.secure_url || json.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const coverUrl = await uploadCoverIfAny();
      const payload = {
        title: form.title,
        theme: form.theme || undefined,
        shortDescription: form.shortDescription || undefined,
        description: form.description || undefined,
        coverImageUrl: coverUrl,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        venueType: form.venueType,
        venueAddress: form.venueAddress || undefined,
        venueCity: form.venueCity || undefined,
        venueState: form.venueState || undefined,
        onlineLink: form.onlineLink || undefined,
        status: form.status,
        featured: !!form.featured,
      };
      const created = await createEvent(payload);
      toast.success("Event created");
      navigate(`/admin/events/${created.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <Link to="/admin/events" className="text-sm text-blue-700 hover:underline">Back to list</Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Title</Label><Input name="title" value={form.title} onChange={handleChange} placeholder="Event title" /></div>
          <div><Label>Theme</Label><Input name="theme" value={form.theme} onChange={handleChange} placeholder="Event theme" /></div>
        </div>
        <div><Label>Short Description</Label><Textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={3} /></div>
        <div><Label>Description</Label><Textarea name="description" value={form.description} onChange={handleChange} rows={6} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Start Date</Label><Input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} /></div>
          <div><Label>End Date</Label><Input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Venue Type</Label>
            <Select name="venueType" value={form.venueType} onChange={handleChange}>
              <option value="physical">physical</option>
              <option value="online">online</option>
              <option value="hybrid">hybrid</option>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select name="status" value={form.status} onChange={handleChange}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Venue Address</Label><Input name="venueAddress" value={form.venueAddress} onChange={handleChange} /></div>
          <div><Label>Online Link</Label><Input name="onlineLink" value={form.onlineLink} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Cover Image</Label>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
            {coverPreview && <img src={coverPreview} alt="cover" className="mt-2 w-full max-h-48 object-cover rounded" />}
          </div>
          <div className="flex items-center">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="featured" checked={!!form.featured} onChange={handleChange} />
              <span className="text-sm text-slate-700">Featured event</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving || loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {(saving || loading) && <Spinner size={16} />} {(saving || loading) ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
