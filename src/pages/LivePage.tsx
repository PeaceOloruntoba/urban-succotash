import { Link } from "react-router";

export default function LivePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Live & Upcoming</h1>
        <Link to="/admin/live" className="text-sm text-blue-700">Creator Studio</Link>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-3">Live now</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <div className="badge-live mb-2">● Live now</div>
            <div className="font-medium">Market Insights with Admin</div>
            <div className="text-sm text-gray-600">Join the broadcast</div>
            <div className="mt-3"><Link to="/live/listen" className="btn-primary">Listen live</Link></div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Upcoming</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <div className="text-xs text-gray-500 mb-2">Today • 5:00 PM</div>
            <div className="font-medium">Financing Tips for Buyers</div>
            <div className="text-sm text-gray-600">Starts soon — set a reminder</div>
            <div className="mt-3"><button className="btn-outline">Remind me</button></div>
          </div>
        </div>
      </section>
    </div>
  );
}
