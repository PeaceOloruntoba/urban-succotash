import { useEffect } from "react";
import { Link } from "react-router";
import {
  Mic2,
  Radio,
  Play,
  Building2,
  ChevronRight,
  Globe,
  Calendar,
  Heart,
  MapPin,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useEventsStore } from "../stores/events";

export default function LandingPage() {
  const { upcomingEvents, fetchUpcomingEvents } = useEventsStore();

  useEffect(() => {
    fetchUpcomingEvents(3);
  }, [fetchUpcomingEvents]);


  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-24 grid md:grid-cols-2 items-center gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Live Now: 1,240 people listening
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] text-slate-900">
            Your Gateway to{" "}
            <span className="text-blue-800">Real Estate Excellence</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            Connect with top realtors, developers, and investors. Browse premium properties, 
            join live podcast sessions, and attend exclusive events. All in one platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/properties"
              className="px-8 py-4 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              <Building2 size={18} /> Browse Properties
            </Link>
            <Link
              to="/podcasts"
              className="px-8 py-4 border-2 border-blue-800 text-blue-800 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <Play size={18} /> Explore Podcasts
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"
            alt="Modern Real Estate"
            className="rounded-3xl shadow-2xl object-cover aspect-[4/5] md:aspect-square w-full"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block max-w-[240px]">
            <div className="flex gap-4 items-center">
              <div className="bg-blue-800 p-3 rounded-lg text-white">
                <Mic2 size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Top Creator
                </p>
                <p className="font-bold text-slate-800">Industry Experts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / STATS BAR */}
      <section className="bg-blue-50 border-y border-blue-100 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-900">500+</div>
            <div className="text-sm text-slate-600">Premium Properties</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900">10k+</div>
            <div className="text-sm text-slate-600">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900">50+</div>
            <div className="text-sm text-slate-600">Live Sessions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900">100%</div>
            <div className="text-sm text-slate-600">Verified Listings</div>
          </div>
        </div>
      </section>

      {/* 3. UPCOMING EVENTS */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-blue-100 text-lg">Don't miss out on these exclusive events</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => {
                const startDate = new Date(event.start_date);
                const formatDateShort = (date: Date) => {
                  return date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                };
                const formatTime = (date: Date) => {
                  return date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                };
                return (
                  <div
                    key={event.id}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all"
                  >
                    {event.cover_image_url ? (
                      <img
                        src={event.cover_image_url}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-blue-700 flex items-center justify-center">
                        <Calendar size={48} className="text-blue-300" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={16} className="text-blue-300" />
                        <span className="text-sm text-blue-100">
                          {formatDateShort(startDate)} • {formatTime(startDate)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                      {event.short_description && (
                        <p className="text-blue-100 text-sm mb-4 line-clamp-2">
                          {event.short_description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-4">
                        {event.venue_type === "physical" || event.venue_type === "hybrid" ? (
                          <div className="flex items-center gap-1 text-blue-200 text-sm">
                            <MapPin size={14} />
                            <span>{event.venue_city || "Physical Event"}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-blue-200 text-sm">
                            <Globe size={14} />
                            <span>Online Event</span>
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="block w-full px-6 py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-all text-center"
                      >
                        Get Tickets
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            {upcomingEvents.length >= 3 && (
              <div className="text-center mt-8">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  View All Events
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. VALUE PROPS */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            From property listings to live podcasts and exclusive events - we've got you covered
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 mb-6 group-hover:bg-blue-800 group-hover:text-white transition-colors">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Premium Properties</h3>
            <p className="text-slate-600 leading-relaxed">
              Browse verified listings from trusted realtors and developers. Find your perfect property 
              with detailed information and direct contact options.
            </p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 mb-6 group-hover:bg-blue-800 group-hover:text-white transition-colors">
              <Mic2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Podcasts</h3>
            <p className="text-slate-600 leading-relaxed">
              Join live sessions with industry experts. Request to speak, engage with comments, 
              and access recorded sessions anytime.
            </p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 mb-6 group-hover:bg-blue-800 group-hover:text-white transition-colors">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Exclusive Events</h3>
            <p className="text-slate-600 leading-relaxed">
              Attend conferences, webinars, and networking events. Book tickets, get exclusive access, 
              and connect with industry leaders.
            </p>
          </div>
        </div>
      </section>

      {/* 5. LIVE & UPCOMING */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold italic">ON AIR NOW</h2>
              <p className="text-slate-400 mt-2">
                Join the conversation with industry leaders.
              </p>
            </div>
            <Link
              to="/live"
              className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold"
            >
              View Schedule <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-red-500 mb-6">
                  <Radio size={20} className="animate-pulse" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    Live Now
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Market Outlook 2026: Commercial vs Residential
                </h3>
                <p className="text-slate-400 mb-8">
                  with Industry Experts & Special Guests
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  to="/live"
                  className="px-6 py-3 bg-blue-600 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-colors"
                >
                  Join Stream
                </Link>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-blue-600 border-2 border-slate-800 flex items-center justify-center text-xs font-bold"
                    >
                      {i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-bold">
                    +2k
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Sustainable Urban Development",
                  time: "Today 5:00 PM",
                  host: "Dev Group",
                },
                {
                  title: "Fix & Flip: ROI Mastery",
                  time: "Tomorrow 10:00 AM",
                  host: "Expert Investors",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="text-blue-400 text-xs font-bold mb-1 flex items-center gap-2">
                      <Calendar size={14} /> {item.time}
                    </div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-slate-400 text-sm">Host: {item.host}</p>
                  </div>
                  <button className="p-3 text-slate-400 hover:text-white transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] -z-0"></div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl shadow-blue-200">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of investors, developers, and real estate professionals. 
            Get access to premium properties, exclusive events, and expert insights.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-4 bg-white text-blue-800 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/properties"
              className="px-10 py-4 border-2 border-blue-300 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xl">
            <Building2 className="text-blue-800" /> SafeNest
          </div>
          <div className="flex gap-8 text-slate-600 text-sm">
            <Link to="/properties" className="hover:text-blue-800 transition-colors">
              Properties
            </Link>
            <Link to="/events" className="hover:text-blue-800 transition-colors">
              Events
            </Link>
            <Link to="/podcasts" className="hover:text-blue-800 transition-colors">
              Podcasts
            </Link>
            <Link to="/live" className="hover:text-blue-800 transition-colors">
              Live
            </Link>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 SafeNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
