import { useState } from "react";
import { api } from "../../lib/axios";
import { fileToBase64 } from "../../lib/base64";

type Props = { initial?: any; onClose: () => void };
export default function PodcastForm({ initial, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [audioUrl, setAudioUrl] = useState(initial?.audio_url || "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url || "");
  const [scheduledAt, setScheduledAt] = useState<string>(
    initial?.scheduled_at || ""
  );
  const [durationSec, setDurationSec] = useState<number | "">(
    initial?.duration_sec || ""
  );

  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);

  const onAudioFile = async (f?: File) => {
    if (!f) return setAudioBase64(null);
    const b64 = await fileToBase64(f);
    setAudioBase64(b64);
  };
  const onCoverFile = async (f?: File) => {
    if (!f) return setCoverBase64(null);
    const b64 = await fileToBase64(f);
    setCoverBase64(b64);
  };

  const save = async () => {
    const payload: any = {
      title,
      description,
      audioUrl: audioUrl || undefined,
      coverUrl: coverUrl || undefined,
      scheduledAt: scheduledAt || undefined,
      durationSec: durationSec === "" ? undefined : Number(durationSec),
      audioBase64: audioBase64 || undefined,
      coverBase64: coverBase64 || undefined,
    };
    if (initial?.id) await api.patch(`/podcasts/${initial.id}`, payload);
    else await api.post(`/podcasts`, payload);
    onClose();
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="text-lg font-semibold">
        {initial?.id ? "Edit" : "New"} Podcast
      </div>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Audio URL"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => onAudioFile(e.target.files?.[0])}
            className="block w-full text-sm"
          />
          {audioBase64 && <div className="text-xs text-blue-700">Audio attached (base64)</div>}
        </div>
        <div className="space-y-2">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Cover URL (optional)"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onCoverFile(e.target.files?.[0])}
            className="block w-full text-sm"
          />
          {coverBase64 && <div className="text-xs text-blue-700">Cover attached (base64)</div>}
        </div>
      </div>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Schedule (ISO, optional)"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Duration sec (optional)"
        value={durationSec}
        onChange={(e) => setDurationSec(e.target.value as any)}
      />
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save}>
          Save
        </button>
        <button className="btn-outline" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
