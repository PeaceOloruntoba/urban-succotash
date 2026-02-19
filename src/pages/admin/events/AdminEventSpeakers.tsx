import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useEventsStore } from "../../../stores/events";
import { api } from "../../../lib/axios";
import { toast } from "sonner";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;

export default function AdminEventSpeakers() {
  const { id } = useParams();
  const { currentEventDetails, fetchAdminEventById, addSpeaker, deleteSpeaker, loading, error } = useEventsStore();
  const [form, setForm] = useState<any>({ name: "", occupation: "", company: "", location: "", description: "", topic: "", displayOrder: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchAdminEventById(id);
  }, [id, fetchAdminEventById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setImageFile(f);
    setImagePreview(f ? URL.createObjectURL(f) : null);
  };

  const uploadImageIfAny = async (): Promise<string | undefined> => {
    if (!imageFile) return undefined;
    const sigRes = await api.post("/podcasts/upload/signature", { resourceType: "image", folder: "events/speakers" });
    const { cloudName, apiKey, timestamp, signature } = sigRes.data?.data || sigRes.data;
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.set("file", imageFile);
    fd.set("api_key", apiKey);
    fd.set("timestamp", String(timestamp));
    fd.set("signature", signature);
    fd.set("folder", "events/speakers");
    const res = await fetch(endpoint, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);
    const json = await res.json();
    return json.secure_url || json.url;
  };

  const onAddSpeaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description required");
      return;
    }
    setSaving(true);
    try {
      const imageUrl = await uploadImageIfAny();
      await addSpeaker(id, {
        name: form.name,
        occupation: form.occupation || undefined,
        company: form.company || undefined,
        location: form.location || undefined,
        description: form.description,
        topic: form.topic || undefined,
        imageUrl,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : 0,
      });
      toast.success("Speaker added");
      setForm({ name: "", occupation: "", company: "", location: "", description: "", topic: "", displayOrder: 0 });
      setImageFile(null);
      setImagePreview(null);
      await fetchAdminEventById(id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add speaker");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (speakerId: string) => {
    if (!id) return;
    if (!confirm("Delete this speaker?")) return;
    try {
      await deleteSpeaker(id, speakerId);
      toast.success("Speaker deleted");
      await fetchAdminEventById(id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete speaker");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Speakers</h1>
        <Link to={`/admin/events/${id}`} className="text-sm text-blue-700 hover:underline">Back to event</Link>
      </div>
      <form onSubmit={onAddSpeaker} className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><Input name="name" value={form.name} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Occupation</label><Input name="occupation" value={form.occupation} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Company</label><Input name="company" value={form.company} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Location</label><Input name="location" value={form.location} onChange={handleChange} /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Topic</label><Input name="topic" value={form.topic} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><Textarea name="description" value={form.description} onChange={handleChange} rows={4} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
            {imagePreview && <img src={imagePreview} alt="speaker" className="mt-2 w-full max-h-40 object-cover rounded" />}
          </div>
          <div><label className="block text-sm font-medium mb-1">Display Order</label><Input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} /></div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving || loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {(saving || loading) && <Spinner size={16} />} {(saving || loading) ? "Saving..." : "Add Speaker"}
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Speakers</h2>
        {loading ? (
          <div className="flex items-center gap-2"><Spinner /> Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !currentEventDetails ? (
          <div className="text-slate-600">Event not found.</div>
        ) : currentEventDetails.speakers.length === 0 ? (
          <div className="bg-white rounded p-6 text-center text-slate-600">No speakers yet.</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {currentEventDetails.speakers.map((s: any) => (
              <div key={s.id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {s.image_url && <img src={s.image_url} alt={s.name} className="w-12 h-12 rounded object-cover" />}
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-slate-600">{s.occupation} {s.company ? `@ ${s.company}` : ""}</p>
                  </div>
                </div>
                <button onClick={() => onDelete(s.id)} className="px-2 py-1 rounded border hover:bg-slate-50">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
