import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-12 md:py-16 grid md:grid-cols-2 items-center gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Stream real estate podcasts for free
          </h1>
          <p className="text-gray-600">
            Listen to experts, realtors, and developers. Discover insights and
            stay informed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/podcasts" className="btn-primary">Explore Podcasts</Link>
            <Link to="/live" className="btn-outline">See Live</Link>
            <Link to="/register" className="btn-outline">Get Started</Link>
          </div>
        </div>
        <div className="aspect-video rounded-lg brand-gradient" />
      </section>
      <section className="py-10 grid sm:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg">
          <div className="font-semibold">Free Streaming</div>
          <p className="text-sm text-gray-600">
            Enjoy unlimited listening without paywalls.
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="font-semibold">Expert Voices</div>
          <p className="text-sm text-gray-600">
            Top realtors and developers share insights.
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="font-semibold">Any Device</div>
          <p className="text-sm text-gray-600">
            Responsive design works on mobile and desktop.
          </p>
        </div>
      </section>
      <section className="py-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Live & Upcoming</h2>
          <Link to="/live" className="text-blue-700 text-sm">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <div className="badge-live mb-2">● Live now</div>
            <div className="font-medium">Market Insights with Admin</div>
            <div className="text-sm text-gray-600">Tap to join the live stream</div>
            <div className="mt-3"><Link to="/live/listen" className="btn-primary">Listen live</Link></div>
          </div>
          <div className="border rounded p-4">
            <div className="text-xs text-gray-500 mb-2">Upcoming • Today 5:00 PM</div>
            <div className="font-medium">Financing Tips for Buyers</div>
            <div className="text-sm text-gray-600">Set a reminder and join on time</div>
            <div className="mt-3"><Link to="/live" className="btn-outline">See details</Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}
