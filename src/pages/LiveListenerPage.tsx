import { useEffect, useState } from "react";
import AudioPlayer from "../components/AudioPlayer";

export default function LiveListenerPage() {
  const [isLive, setIsLive] = useState(true);
  setIsLive(true)
  const [liveTitle, setLiveTitle] = useState("Market Insights with Admin");
  setLiveTitle("Community Discussion Live");
  const [sourceUrl, setSourceUrl] = useState<string>("");

  useEffect(() => {
    // Placeholder: When backend live is ready, fetch a live stream URL (e.g., HLS/DASH).
    // setIsLive(true/false) based on backend status.
    // For design, we show a sample audio stream url or keep empty.
    setSourceUrl("");
  }, []);

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
