import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "../../lib/axios";
import { connectWs, type WSMessage } from "../../lib/ws";

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
  speakers: Array<{ id: number; user_id: string | null; name: string | null; muted: boolean }>;
} | null;

export default function LiveStudio() {
  const [params, setParams] = useSearchParams();
  const sessionId = params.get("session") || "";
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [studio, setStudio] = useState<StudioInfo>(null);
  const [loading, setLoading] = useState(false);
  const [speakerName, setSpeakerName] = useState("");
  const [speakerUserId, setSpeakerUserId] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const loadStudio = async (id: string) => {
    setLoading(true);
    try {
      const r = await api.get(`/live/${id}/studio`);
      setStudio(r.data?.data ?? null);
    } finally { setLoading(false); }
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
    return () => { try { ws.close(); } catch {} };
  }, [sessionId]);

  const createOrSchedule = async () => {
    setLoading(true);
    try {
      const r = await api.post("/live", { title, scheduledAt: scheduledAt || undefined });
      const id = r.data?.data?.item?.id as string;
      if (id) {
        setParams({ session: id });
      }
    } finally { setLoading(false); }
  };

  const startLive = async () => {
    if (!sessionId) return;
    await api.post(`/live/${sessionId}/start`);
    await loadStudio(sessionId);
  };

  const stopLive = async () => {
    if (!sessionId) return;
    await api.post(`/live/${sessionId}/stop`);
    await loadStudio(sessionId);
  };

  const addSpeaker = async () => {
    if (!sessionId) return;
    const payload: any = {};
    if (speakerUserId.trim()) payload.userId = speakerUserId.trim();
    if (speakerName.trim()) payload.name = speakerName.trim();
    if (!payload.userId && !payload.name) return;
    await api.post(`/live/${sessionId}/speakers`, payload);
    setSpeakerUserId("");
    setSpeakerName("");
    await loadStudio(sessionId);
  };

  const toggleMute = async (speakerId: number, current: boolean) => {
    if (!sessionId) return;
    await api.patch(`/live/${sessionId}/speakers/${speakerId}`, { muted: !current });
  };

  const removeSpeaker = async (speakerId: number) => {
    if (!sessionId) return;
    await api.delete(`/live/${sessionId}/speakers/${speakerId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">Creator Live Studio</h1>

      {!sessionId ? (
        <section className="border rounded p-4 space-y-3">
          <div className="font-medium">Create / Schedule Live</div>
          <input className="w-full border rounded px-3 py-2" placeholder="Live title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Schedule (ISO, optional)" value={scheduledAt} onChange={(e)=>setScheduledAt(e.target.value)} />
          <div className="flex gap-2">
            <button className="btn-primary" disabled={loading || !title.trim()} onClick={createOrSchedule}>Create</button>
          </div>
          <div className="text-xs text-gray-600">You can start immediately or just schedule. A matching podcast will be created automatically.</div>
        </section>
      ) : (
        <>
          <section className="border rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Session</div>
              <div className="text-xs text-gray-500">ID: {studio?.session.id}</div>
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
                <div className="font-medium">{studio?.session.scheduled_at || "-"}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-500">Ingest URL</div>
                <div className="font-mono text-xs break-all">{studio?.session.ingest_url || ""}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Stream Key</div>
                <div className="font-mono text-xs break-all">{studio?.session.stream_key || ""}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Playback URL</div>
                <div className="font-mono text-xs break-all">{studio?.session.playback_url || ""}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {studio?.session.status === "live" ? (
                <button className="btn-outline" onClick={stopLive}>Stop</button>
              ) : (
                <button className="btn-primary" onClick={startLive}>Start Live</button>
              )}
            </div>
          </section>

          <section className="border rounded p-4 space-y-3">
            <div className="font-medium">Speakers</div>
            <div className="grid sm:grid-cols-2 gap-2">
              <input className="w-full border rounded px-3 py-2" placeholder="User ID (optional)" value={speakerUserId} onChange={(e)=>setSpeakerUserId(e.target.value)} />
              <input className="w-full border rounded px-3 py-2" placeholder="Guest Name (optional)" value={speakerName} onChange={(e)=>setSpeakerName(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={addSpeaker}>Add Speaker</button>
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
                        <button className="px-2 py-1 rounded border" onClick={()=>toggleMute(sp.id, sp.muted)}>{sp.muted?"Unmute":"Mute"}</button>
                        <button className="px-2 py-1 rounded border text-red-600" onClick={()=>removeSpeaker(sp.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
