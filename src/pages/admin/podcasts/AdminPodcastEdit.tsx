import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";
import { usePodcastsStore } from "../../../stores/podcasts";
import { api } from "../../../lib/axios";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Select = (props: any) => <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;

export default function AdminPodcastEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPodcast, fetchAdminPodcastById, updatePodcast, loading } = usePodcastsStore();
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === 'new') {
      return;
    }
    (async () => {
      setError(null);
      try {
        const item = await fetchAdminPodcastById(id);
        setForm(item || {});
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load podcast");
      }
    })();
  }, [id, fetchAdminPodcastById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    setCoverPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setMediaFile(f);
    setMediaPreviewUrl(f ? URL.createObjectURL(f) : null);
    if (f) setMediaUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...form };
      if (coverFile) {
        const sigRes = await api.post("/podcasts/upload/signature", { resourceType: "image", folder: "podcasts/cover" });
        const { cloudName, apiKey, timestamp, signature } = sigRes.data?.data || sigRes.data;
        const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();
        formData.set("file", coverFile);
        formData.set("api_key", apiKey);
        formData.set("timestamp", String(timestamp));
        formData.set("signature", signature);
        formData.set("folder", "podcasts/cover");
        const res = await fetch(endpoint, { method: "POST", body: formData });
        if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);
        const json = await res.json();
        payload.coverUrl = json.secure_url || json.url;
      }
      if (mediaFile) {
        const isVideo = /video\//.test(mediaFile.type) || /\.(mp4|webm|m3u8)$/i.test(mediaFile.name);
        const sigRes = await api.post("/podcasts/upload/signature", { resourceType: isVideo ? "video" : "auto", folder: isVideo ? "podcasts/video" : "podcasts/audio" });
        const { cloudName, apiKey, timestamp, signature } = sigRes.data?.data || sigRes.data;
        const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "auto"}/upload`;
        const formData = new FormData();
        formData.set("file", mediaFile);
        formData.set("api_key", apiKey);
        formData.set("timestamp", String(timestamp));
        formData.set("signature", signature);
        formData.set("folder", isVideo ? "podcasts/video" : "podcasts/audio");
        const res = await fetch(endpoint, { method: "POST", body: formData });
        if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);
        const json = await res.json();
        const url = json.secure_url || json.url;
        if (isVideo) payload.videoUrl = url;
        else payload.audioUrl = url;
      } else if (mediaUrl.trim()) {
        const isVideo = /\.(mp4|webm|m3u8)(\?|$)/i.test(mediaUrl);
        if (isVideo) payload.videoUrl = mediaUrl.trim();
        else payload.audioUrl = mediaUrl.trim();
      }
      await updatePodcast(id!, payload);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
            {(coverPreview || currentPodcast?.cover_url) && (
              <img src={coverPreview || currentPodcast?.cover_url || undefined} alt="cover" className="mt-2 w-full max-h-48 object-cover rounded" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Media File (audio or video)</label>
            <input type="file" accept="audio/*,video/*" onChange={handleMediaChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
            <label className="block text-sm font-medium mt-3 mb-1">Or Media URL</label>
            <Input value={mediaUrl} onChange={(e: any) => setMediaUrl(e.target.value)} placeholder="https://..." />
            <div className="text-xs text-slate-600 mt-1">Provide a direct URL to audio/video if not uploading a file</div>
            {(mediaPreviewUrl || currentPodcast?.audio_url) && (
              <div className="mt-3">
                {(/\.(mp4|webm|m3u8)(\?|$)/i.test(mediaPreviewUrl || currentPodcast?.audio_url || "")) ? (
                  <video src={mediaPreviewUrl || currentPodcast?.audio_url || undefined} controls className="w-full rounded-lg shadow" />
                ) : (
                  <audio src={mediaPreviewUrl || currentPodcast?.audio_url || undefined} controls className="w-full" />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {saving && <Spinner size={16} />} {saving ? 'Saving...' : 'Save Podcast'}
          </button>
        </div>
      </form>
    </div>
  );
}
