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
          <div className="flex gap-3">
            <Link
              to="/podcasts"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Explore Podcasts
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded border hover:bg-gray-50"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="aspect-video bg-gray-100 rounded-lg" />
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
    </div>
  );
}
