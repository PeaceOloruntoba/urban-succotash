import { useEffect, useRef, useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import { useSearchParams } from "react-router";
import { api } from "../lib/axios";
import { connectWs, type WSMessage } from "../lib/ws";

export default function LiveListenerPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session");
  const [isLive, setIsLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState("Live Session");
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    api.get(`/live/${sessionId}`).then(r => {
      const item = r.data?.data?.item;
      if (item) {
        setLiveTitle(item.title || "Live Session");
        setIsLive(item.status === "live");
        if (item.playback_url) setSourceUrl(item.playback_url);
      }
    });

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
      {isLive ? (
        sourceUrl ? (
          <AudioPlayer src={sourceUrl} />
        ) : (
          <div className="border rounded p-4 text-sm text-gray-600">Live is starting shortly…</div>
        )
      ) : (
        <div className="border rounded p-4 text-sm text-gray-600">No live session is active right now.</div>
      )}
    </div>
  );
}
