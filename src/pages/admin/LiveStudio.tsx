import { useState } from "react";

export default function LiveStudio() {
  const [isLive, setIsLive] = useState(false);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const startLive = async () => {
    // TODO: call backend to initiate live session
    setIsLive(true);
  };

  const stopLive = async () => {
    // TODO: call backend to stop live session
    setIsLive(false);
  };

  const schedule = async () => {
    // TODO: call backend to schedule a live session
    alert("Scheduled!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">Creator Live Studio</h1>

      <section className="border rounded p-4 space-y-3">
        <div className="font-medium">Go Live</div>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Live title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-2">
          {isLive ? (
            <button className="btn-outline" onClick={stopLive}>Stop</button>
          ) : (
            <button className="btn-primary" onClick={startLive}>Start Live</button>
          )}
        </div>
        <div className="text-xs text-gray-600">When integrated, this will start a live audio stream; listeners will see it under Live pages.</div>
      </section>

      <section className="border rounded p-4 space-y-3">
        <div className="font-medium">Schedule Live</div>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="YYYY-MM-DDTHH:mm:ssZ"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
        <button className="btn-outline" onClick={schedule}>Schedule</button>
        <div className="text-xs text-gray-600">Pick a future ISO date-time to publish a live session announcement.</div>
      </section>
    </div>
  );
}
