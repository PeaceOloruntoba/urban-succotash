import { useEffect, useRef, useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import { useSearchParams } from "react-router";
import { api } from "../lib/axios";
import { connectWs, type WSMessage } from "../lib/ws";
import Spinner from "../components/Spinner";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth";

export default function LiveListenerPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session");
  const { user } = useAuthStore();
  const [isLive, setIsLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState("Live Session");
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [speakRequested, setSpeakRequested] = useState(false);
  const [speakRequestStatus, setSpeakRequestStatus] = useState<"pending" | "approved" | "rejected" | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      setLoading(true);
      try {
        const r = await api.get(`/live/${sessionId}`);
        const item = r.data?.data?.item;
        if (item) {
          setLiveTitle(item.title || "Live Session");
          setIsLive(item.status === "live");
          if (item.playback_url) setSourceUrl(item.playback_url);
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    })();

    // Open WS and listen to studio events
    const ws = connectWs();
    wsRef.current = ws;
    ws.onmessage = (e) => {
      try {
        const msg: WSMessage = JSON.parse(String(e.data));
        if (msg.channel !== `studio:${sessionId}`) return;
        if (msg.type === "session.started") {
          setIsLive(true);
          if (msg.payload?.playback_url) setSourceUrl(msg.payload.playback_url);
        } else if (msg.type === "session.stopped") {
          setIsLive(false);
        } else if (msg.type === "session.updated") {
          if (msg.payload?.title) setLiveTitle(msg.payload.title);
        }
      } catch {}
    };
    return () => {
      try { ws.close(); } catch {}
    };
  }, [sessionId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-2">
        {isLive ? <span className="badge-live">● Live</span> : <span className="text-xs px-2 py-0.5 rounded bg-gray-200">Offline</span>}
        <h1 className="text-xl font-semibold">{liveTitle}</h1>
      </div>
      <p className="text-gray-600">Join the live broadcast and listen in real-time.</p>
      {loading ? (
        <div className="py-6"><Spinner /></div>
      ) : isLive ? (
        sourceUrl ? (
          <AudioPlayer src={sourceUrl} />
        ) : (
          <div className="border rounded p-4 text-sm text-gray-600">Live is starting shortly…</div>
        )
      ) : (
        <div className="border rounded p-4 text-sm text-gray-600">No live session is active right now.</div>
      )}

      {/* Speak Request */}
      {isLive && user && sessionId && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Request to Speak</h3>
          <p className="text-sm text-slate-600 mb-4">
            Request permission to speak during this live session. The admin will review your request.
          </p>
          {speakRequestStatus === null ? (
            <button
              onClick={async () => {
                try {
                  await api.post(`/live/${sessionId}/speak-request`);
                  setSpeakRequested(true);
                  setSpeakRequestStatus("pending");
                  toast.success("Speak request submitted!");
                } catch (err: any) {
                  if (err.response?.status === 400 && err.response?.data?.message?.includes("already exists")) {
                    setSpeakRequested(true);
                    setSpeakRequestStatus("pending");
                    toast.info("You already have a pending request");
                  } else {
                    toast.error(err.response?.data?.message || "Failed to submit request");
                  }
                }
              }}
              disabled={speakRequested}
              className="btn btn-primary"
            >
              {speakRequested ? "Request Submitted" : "Request to Speak"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  speakRequestStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : speakRequestStatus === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {speakRequestStatus === "approved"
                  ? "✓ Approved"
                  : speakRequestStatus === "rejected"
                  ? "✗ Rejected"
                  : "⏳ Pending"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
