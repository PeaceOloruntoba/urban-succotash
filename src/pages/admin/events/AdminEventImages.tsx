import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useEventsStore } from "../../../stores/events";
import { api } from "../../../lib/axios";
import { toast } from "sonner";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;

export default function AdminEventImages() {
  const { id } = useParams();
  const { currentEventDetails, fetchAdminEventById, addEventImage, deleteEventImage, loading, error } = useEventsStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isThumbnail, setIsThumbnail] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchAdminEventById(id);
  }, [id, fetchAdminEventById]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const uploadImage = async (): Promise<string | undefined> => {
    if (!file) return undefined;
    const sigRes = await api.post("/podcasts/upload/signature", { resourceType: "image", folder: "events/images" });
    const { cloudName, apiKey, timestamp, signature } = sigRes.data?.data || sigRes.data;
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.set("file", file);
    fd.set("api_key", apiKey);
    fd.set("timestamp", String(timestamp));
    fd.set("signature", signature);
    fd.set("folder", "events/images");
    const res = await fetch(endpoint, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);
    const json = await res.json();
    return json.secure_url || json.url;
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!file) {
      toast.error("Select an image");
      return;
    }
    setSaving(true);
    try {
      const imageUrl = await uploadImage();
      await addEventImage(id, { imageUrl, isThumbnail, displayOrder });
      toast.success("Image added");
      setFile(null);
      setPreview(null);
      setIsThumbnail(false);
      setDisplayOrder(0);
      await fetchAdminEventById(id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add image");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (imageId: string) => {
    if (!id) return;
    if (!confirm("Delete this image?")) return;
    try {
      await deleteEventImage(id, imageId);
      toast.success("Image deleted");
      await fetchAdminEventById(id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete image");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Images</h1>
        <Link to={`/admin/events/${id}`} className="text-sm text-blue-700 hover:underline">Back to event</Link>
      </div>
      <form onSubmit={onAdd} className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image file</label>
            <input type="file" accept="image/*" onChange={onFileChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
            {preview && <img src={preview} alt="event" className="mt-2 w-full max-h-40 object-cover rounded" />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display order</label>
            <Input type="number" value={displayOrder} onChange={(e: any) => setDisplayOrder(Number(e.target.value || 0))} />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={isThumbnail} onChange={(e) => setIsThumbnail(e.target.checked)} />
              <span className="text-sm text-slate-700">Mark as thumbnail</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving || loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {(saving || loading) && <Spinner size={16} />} {(saving || loading) ? "Uploading..." : "Add Image"}
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Images</h2>
        {loading ? (
          <div className="flex items-center gap-2"><Spinner /> Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !currentEventDetails ? (
          <div className="text-slate-600">Event not found.</div>
        ) : currentEventDetails.images.length === 0 ? (
          <div className="bg-white rounded p-6 text-center text-slate-600">No images yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentEventDetails.images.map((img: any) => (
              <div key={img.id} className="relative group">
                <img src={img.image_url} alt="event" className="w-full h-28 object-cover rounded" />
                <div className="absolute top-2 right-2">
                  <button onClick={() => onDelete(img.id)} className="px-2 py-1 rounded border bg-white/90 hover:bg-white text-xs">Delete</button>
                </div>
                {img.is_thumbnail && <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Thumbnail</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
