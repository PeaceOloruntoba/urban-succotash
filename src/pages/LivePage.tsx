import { Link } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

export default function LivePage() {
  const [now, setNow] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    api.get("/live/now").then(r => setNow(r.data?.data?.items ?? []));
    api.get("/live/upcoming").then(r => setUpcoming(r.data?.data?.items ?? []));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Live & Upcoming</h1>
        <Link to="/admin/live" className="text-sm text-blue-700">Creator Studio</Link>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-3">Live now</h2>
        {now.length === 0 ? (
          <div className="text-sm text-gray-600">No live session is active right now.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {now.map((s:any) => (
              <div className="border rounded p-4" key={s.id}>
                <div className="badge-live mb-2">● Live now</div>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-600">Join the broadcast</div>
                <div className="mt-3"><Link to={`/live/listen?session=${s.id}`} className="btn-primary">Listen live</Link></div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="text-sm text-gray-600">No upcoming sessions.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {upcoming.map((u:any) => (
              <div className="border rounded p-4" key={u.id}>
                <div className="text-xs text-gray-500 mb-2">{u.scheduled_at || "Scheduled"}</div>
                <div className="font-medium">{u.title}</div>
                <div className="text-sm text-gray-600">Starts soon — set a reminder</div>
                <div className="mt-3"><Link to="/podcasts" className="btn-outline">See details</Link></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
