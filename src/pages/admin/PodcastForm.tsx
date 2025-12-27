import { useState } from "react";
import { api } from "../../lib/axios";

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

  const save = async () => {
    const payload: any = {
      title,
      description,
      audioUrl: audioUrl || undefined,
      coverUrl: coverUrl || undefined,
      scheduledAt: scheduledAt || undefined,
      durationSec: durationSec === "" ? undefined : Number(durationSec),
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
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Audio URL (or upload via Base64 later)"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Cover URL (optional)"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
      />
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
        <button className="px-3 py-1 rounded border" onClick={save}>
          Save
        </button>
        <button className="px-3 py-1 rounded border" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
