import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePodcastsStore } from "../../../stores/podcasts";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";
import { api } from "../../../lib/axios";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Label = ({ children }: { children: any }) => <label className="block text-sm font-medium mb-1">{children}</label>;

export default function AdminPodcastCreate() {
  const navigate = useNavigate();
  const { createPodcast, loading } = usePodcastsStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | undefined>(undefined);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [publishNow, setPublishNow] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    setCoverPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setMediaFile(f);
    setMediaPreviewUrl(f ? URL.createObjectURL(f) : null);
    // Clear explicit URL if picking file
    if (f) setMediaUrl("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!mediaFile && !mediaUrl.trim()) {
      toast.error("Provide a media file (audio/video) or a media URL");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        title,
        description: description || undefined,
        durationSec,
        scheduledAt: scheduledAt || null,
        publishedAt: publishNow ? new Date().toISOString() : null,
      };
      const directUpload = async (file: File, resourceType: "image" | "video" | "auto", folder: string) => {
        const sigRes = await api.post("/podcasts/upload/signature", { resourceType, folder });
        const { cloudName, apiKey, timestamp, signature } = sigRes.data?.data || sigRes.data;
        const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        const form = new FormData();
        form.set("file", file);
        form.set("api_key", apiKey);
        form.set("timestamp", String(timestamp));
        form.set("signature", signature);
        form.set("folder", folder);
        const res = await fetch(endpoint, { method: "POST", body: form });
        if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);
        const json = await res.json();
        return json.secure_url || json.url;
      };
      if (mediaFile) {
        const isVideo = /video\//.test(mediaFile.type) || /\.(mp4|webm|m3u8)$/i.test(mediaFile.name);
        const url = await directUpload(mediaFile, isVideo ? "video" : "auto", isVideo ? "podcasts/video" : "podcasts/audio");
        if (isVideo) payload.videoUrl = url;
        else payload.audioUrl = url;
      } else if (mediaUrl.trim()) {
        const isVideo = /\.(mp4|webm|m3u8)(\?|$)/i.test(mediaUrl);
        if (isVideo) payload.videoUrl = mediaUrl.trim();
        else payload.audioUrl = mediaUrl.trim();
      }
      if (coverFile) {
        const coverUrl = await directUpload(coverFile, "image", "podcasts/cover");
        payload.coverUrl = coverUrl;
      }
      const created = await createPodcast(payload);
      toast.success("Podcast created");
      navigate(`/admin/podcasts/${created.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create podcast");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create Podcast</h1>
        <Link to="/admin/podcasts" className="text-sm text-blue-700 hover:underline">Back to list</Link>
      </div>
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e: any) => setTitle(e.target.value)} placeholder="Podcast title" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e: any) => setDescription(e.target.value)} rows={5} placeholder="Episode description" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Media File (audio or video)</Label>
            <input type="file" accept="audio/*,video/*" onChange={handleMediaChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
            <div className="text-xs text-slate-600 mt-1">Supports long videos (mp4/webm) and audio</div>
            {mediaPreviewUrl && (
              <div className="mt-3">
                {(/\\.(mp4|webm)$/i.test(mediaFile?.name || "")) ? (
                  <video src={mediaPreviewUrl} controls className="w-full rounded-lg shadow" />
                ) : (
                  <audio src={mediaPreviewUrl} controls className="w-full" />
                )}
              </div>
            )}
          </div>
          <div>
            <Label>Or Media URL</Label>
            <Input value={mediaUrl} onChange={(e: any) => setMediaUrl(e.target.value)} placeholder="https://..." />
            <div className="text-xs text-slate-600 mt-1">Provide a direct URL to audio/video if not uploading a file</div>
            {mediaUrl && (
              <div className="mt-3">
                {(/\\.(mp4|webm|m3u8)(\\?|$)/i.test(mediaUrl)) ? (
                  <video src={mediaUrl} controls className="w-full rounded-lg shadow" />
                ) : (
                  <audio src={mediaUrl} controls className="w-full" />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Cover Image</Label>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" />
            {coverPreview && (
              <img src={coverPreview} alt="cover preview" className="mt-2 w-full max-h-48 object-cover rounded" />
            )}
          </div>
          <div>
            <Label>Duration (seconds, optional)</Label>
            <Input
              type="number"
              min={0}
              value={durationSec ?? ""}
              onChange={(e: any) => setDurationSec(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 3600"
            />
            <div className="text-xs text-slate-600 mt-1">If omitted, streams can infer duration later</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Schedule At (optional)</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e: any) => setScheduledAt(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input id="publishNow" type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} />
            <Label><span className="ml-2">Publish now</span></Label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            {(saving || loading) && <Spinner size={16} />} {(saving || loading) ? "Creating..." : "Create Podcast"}
          </button>
        </div>
      </form>
    </div>
  );
}
