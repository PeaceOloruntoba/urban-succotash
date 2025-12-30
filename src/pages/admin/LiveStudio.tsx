import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "../../lib/axios";
import { connectWs, type WSMessage } from "../../lib/ws";
import { fileToBase64 } from "../../lib/base64";
import Spinner from "../../components/Spinner";
import { toast } from "sonner";

type StudioInfo = {
  session: {
    id: string;
    title: string;
    status: string;
    scheduled_at?: string | null;
    ingest_url?: string | null;
    stream_key?: string | null;
    playback_url?: string | null;
  };
  speakers: Array<{
    id: number;
    user_id: string | null;
    name: string | null;
    muted: boolean;
  }>;
} | null;

export default function LiveStudio() {
  const [params, setParams] = useSearchParams();
  const sessionId = params.get("session") || "";
  // const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [studio, setStudio] = useState<StudioInfo>(null);
  const [loading, setLoading] = useState(false);
  const [speakerName, setSpeakerName] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  // Upload recorded podcast state
  const [podTitle, setPodTitle] = useState("");
  const [podDesc, setPodDesc] = useState("");
  const [podAudioB64, setPodAudioB64] = useState<string>("");
  const [podCoverB64, setPodCoverB64] = useState<string>("");
  const [podDuration, setPodDuration] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  // Users and scheduling helpers
  const [users, setUsers] = useState<Array<{ id: string; email: string; display_name: string | null }>>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const loadStudio = async (id: string) => {
    setLoading(true);
    try {
      const r = await api.get(`/live/${id}/studio`);
      setStudio(r.data?.data ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    loadStudio(sessionId);
    const ws = connectWs();
    wsRef.current = ws;
    ws.onmessage = (e) => {
      try {
        const msg: WSMessage = JSON.parse(String(e.data));
        if (msg.channel !== `studio:${sessionId}`) return;
        if (msg.type?.startsWith("session.")) {
          loadStudio(sessionId);
        } else if (msg.type?.startsWith("speaker.")) {
          loadStudio(sessionId);
        }
      } catch {}
    };
    return () => {
      try {
        ws.close();
      } catch {}
    };
  }, [sessionId]);

  // Load platform users for multi-select (admin-only)
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/users");
        setUsers(r.data?.data?.users ?? []);
      } catch {}
    })();
  }, []);

  const createOrSchedule = async () => {
    setLoading(true);
    try {
      let scheduledAtVal: string | undefined = undefined;
      if (scheduledDate && scheduledTime) {
        const dt = new Date(`${scheduledDate}T${scheduledTime}`);
        if (!isNaN(dt.getTime())) scheduledAtVal = dt.toISOString();
      }
      const r = await api.post("/live", { title, scheduledAt: scheduledAtVal });
      const id = r.data?.data?.item?.id as string;
      if (id) {
        setParams({ session: id });
        toast.success("Session created");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [addingSpeaker, setAddingSpeaker] = useState(false);

  const startLive = async () => {
    if (!sessionId) return;
    setStarting(true);
    try {
      await api.post(`/live/${sessionId}/start`);
      await loadStudio(sessionId);
      toast.success("Live started");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to start live");
    } finally {
      setStarting(false);
    }
  };

  const stopLive = async () => {
    if (!sessionId) return;
    setStopping(true);
    try {
      await api.post(`/live/${sessionId}/stop`);
      await loadStudio(sessionId);
      toast.success("Live stopped");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to stop live");
    } finally {
      setStopping(false);
    }
  };

  const addSpeaker = async () => {
    if (!sessionId) return;
    if (selectedUserIds.length === 0 && !speakerName.trim()) return;
    setAddingSpeaker(true);
    try {
      // Add selected platform users
      for (const uid of selectedUserIds) {
        await api.post(`/live/${sessionId}/speakers`, { userId: uid });
      }
      // Optional guest by name
      if (speakerName.trim()) {
        await api.post(`/live/${sessionId}/speakers`, { name: speakerName.trim() });
      }
      setSelectedUserIds([]);
      setSpeakerName("");
      await loadStudio(sessionId);
      toast.success("Speakers added");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add speaker");
    } finally {
      setAddingSpeaker(false);
    }
  };

  const toggleMute = async (speakerId: number, current: boolean) => {
    if (!sessionId) return;
    try {
      await api.patch(`/live/${sessionId}/speakers/${speakerId}`, { muted: !current });
      toast.success(!current ? "Speaker muted" : "Speaker unmuted");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update speaker");
    }
  };

  const removeSpeaker = async (speakerId: number) => {
    if (!sessionId) return;
    try {
      await api.delete(`/live/${sessionId}/speakers/${speakerId}`);
      toast.success("Speaker removed");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to remove speaker");
    }
  };

  const onPickAudio = async (f: File | null) => {
    if (!f) return setPodAudioB64("");
    const b64 = await fileToBase64(f);
    console.log(b64)
    setPodAudioB64(b64);
  };
  const onPickCover = async (f: File | null) => {
    if (!f) return setPodCoverB64("");
    const b64 = await fileToBase64(f);
    setPodCoverB64(b64);
  };
  const uploadPodcast = async () => {
    if (!podTitle.trim() || !podAudioB64) return;
    setUploading(true);
    try {
      const payload: any = {
        title: podTitle.trim(),
        description: podDesc || undefined,
        audioBase64: podAudioB64,
        coverBase64: podCoverB64 || undefined,
      };
      const dur = Number(podDuration);
      if (!Number.isNaN(dur) && dur > 0) payload.durationSec = dur;
      console.log("YY: Uploading")
      const r = await api.post("/podcasts", payload);
      console.log("Upload response:", r.data);
      const podcastId: string | undefined = r.data?.data?.item?.id;
      if (podcastId) {
        // Immediately publish so it appears in public lists and is playable
        try { await api.post(`/podcasts/${podcastId}/publish`); } catch {}
      }
      toast.success("Podcast uploaded" + (podcastId ? " & published" : ""));
      setPodTitle("");
      setPodDesc("");
      setPodAudioB64("");
      setPodCoverB64("");
      setPodDuration("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">Creator Live Studio</h1>

      {!sessionId ? (
        <>
          <section className="border rounded p-4 space-y-3">
            <div className="font-medium">Create / Schedule Live</div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Live title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-2">
              <input type="date" className="w-full border rounded px-3 py-2" value={scheduledDate} onChange={(e)=>setScheduledDate(e.target.value)} />
              <input type="time" className="w-full border rounded px-3 py-2" value={scheduledTime} onChange={(e)=>setScheduledTime(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex items-center gap-2" disabled={loading || !title.trim()} onClick={createOrSchedule}>
                {loading && <Spinner size={16} />}<span>Create</span>
              </button>
            </div>
            <div className="text-xs text-gray-600">
              You can start immediately or just schedule. A matching podcast
              will be created automatically.
            </div>
          </section>
          <section className="border rounded p-4 space-y-3">
            <div className="font-medium">Upload Recorded Podcast</div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Title"
              value={podTitle}
              onChange={(e) => setPodTitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description (optional)"
              value={podDesc}
              onChange={(e) => setPodDesc(e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Audio File</div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => onPickAudio(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  Cover Image (optional)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickCover(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Duration seconds (optional)"
              value={podDuration}
              onChange={(e) => setPodDuration(e.target.value)}
            />
            <div className="flex gap-2">
              <button className="btn-primary flex items-center gap-2" disabled={uploading || !podTitle.trim() || !podAudioB64} onClick={uploadPodcast}>
                {uploading && <Spinner size={16} />}<span>Upload Podcast</span>
              </button>
            </div>
            <div className="text-xs text-gray-600">
              This will create a published podcast entry using your uploaded
              media.
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="border rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Session</div>
              <div className="text-xs text-gray-500">
                ID: {studio?.session.id}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-500">Title</div>
                <div className="font-medium">{studio?.session.title}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-medium">{studio?.session.status}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Scheduled</div>
                <div className="font-medium">
                  {studio?.session.scheduled_at || "-"}
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-500">Ingest URL</div>
                <div className="font-mono text-xs break-all">
                  {studio?.session.ingest_url || ""}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Stream Key</div>
                <div className="font-mono text-xs break-all">
                  {studio?.session.stream_key || ""}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Playback URL</div>
                <div className="font-mono text-xs break-all">
                  {studio?.session.playback_url || ""}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {studio?.session.status === "live" ? (
                <button className="btn-outline flex items-center gap-2" onClick={stopLive} disabled={stopping}>
                  {stopping && <Spinner size={16} />}<span>Stop</span>
                </button>
              ) : (
                <button className="btn-primary flex items-center gap-2" onClick={startLive} disabled={starting}>
                  {starting && <Spinner size={16} />}<span>Start Live</span>
                </button>
              )}
            </div>
          </section>

          <section className="border rounded p-4 space-y-3">
            <div className="font-medium">Speakers</div>
            <div className="grid sm:grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Select platform speakers</div>
                <select multiple className="w-full border rounded px-3 py-2 h-32" value={selectedUserIds} onChange={(e)=>{
                  const vs = Array.from(e.target.selectedOptions).map(o=>o.value);
                  setSelectedUserIds(vs);
                }}>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.display_name || u.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Add guest (optional)</div>
                <input className="w-full border rounded px-3 py-2" placeholder="Guest Name" value={speakerName} onChange={(e)=>setSpeakerName(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline flex items-center gap-2" onClick={addSpeaker} disabled={addingSpeaker}>
                {addingSpeaker && <Spinner size={16} />}<span>Add Speaker</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">User</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Muted</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studio?.speakers?.map((sp) => (
                    <tr key={sp.id} className="border-t">
                      <td className="p-2 border">{sp.id}</td>
                      <td className="p-2 border">{sp.user_id || "-"}</td>
                      <td className="p-2 border">{sp.name || "-"}</td>
                      <td className="p-2 border">{sp.muted ? "Yes" : "No"}</td>
                      <td className="p-2 border space-x-2">
                        <button
                          className="px-2 py-1 rounded border"
                          onClick={() => toggleMute(sp.id, sp.muted)}
                        >
                          {sp.muted ? "Unmute" : "Mute"}
                        </button>
                        <button
                          className="px-2 py-1 rounded border text-red-600"
                          onClick={() => removeSpeaker(sp.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="border rounded p-4 space-y-3">
            <div className="font-medium">Upload Recorded Podcast</div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Title"
              value={podTitle}
              onChange={(e) => setPodTitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description (optional)"
              value={podDesc}
              onChange={(e) => setPodDesc(e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Audio File</div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => onPickAudio(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  Cover Image (optional)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickCover(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Duration seconds (optional)"
              value={podDuration}
              onChange={(e) => setPodDuration(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="btn-primary"
                disabled={uploading || !podTitle.trim() || !podAudioB64}
                onClick={uploadPodcast}
              >
                Upload Podcast
              </button>
            </div>
            <div className="text-xs text-gray-600">
              This will create a published podcast entry using your uploaded
              media.
            </div>
          </section>
        </>
      )}
    </div>
  );
}
