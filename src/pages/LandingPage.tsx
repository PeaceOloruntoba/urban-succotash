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
  Ticket,
} from "lucide-react";
import { useEventsStore } from "../stores/events";
import { usePropertiesStore } from "../stores/properties";
import { usePodcastsStore } from "../stores/podcasts";

export default function LandingPage() {
  const { upcomingEvents, fetchUpcomingEvents } = useEventsStore();
  const { featuredProperties, fetchFeaturedProperties } = usePropertiesStore();
  const { featuredPodcasts, fetchFeaturedPodcasts } = usePodcastsStore();

  useEffect(() => {
    fetchUpcomingEvents(1); // Only next event
    fetchFeaturedProperties(3);
    fetchFeaturedPodcasts(3);
  }, [fetchUpcomingEvents, fetchFeaturedProperties, fetchFeaturedPodcasts]);


  return (
    <>
      <SEO />
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

      {/* 3. NEXT UPCOMING EVENT - LARGE DISPLAY */}
      {upcomingEvents.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-700/50 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Calendar size={16} />
                Next Upcoming Event
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Don't Miss Out
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Join industry leaders for exclusive insights and networking opportunities
              </p>
            </div>

            {upcomingEvents[0] && (() => {
              const event = upcomingEvents[0];
              const startDate = new Date(event.start_date);
              const endDate = new Date(event.end_date);
              const formatDate = (date: Date) => {
                return date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
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
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      {event.cover_image_url ? (
                        <img
                          src={event.cover_image_url}
                          alt={event.title}
                          className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
                        />
                      ) : (
                        <div className="w-full h-64 md:h-80 bg-white/10 rounded-2xl flex items-center justify-center">
                          <Calendar size={64} className="text-white/30" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-6">
                      {event.theme && (
                        <div className="inline-block px-4 py-2 bg-blue-700/50 rounded-full text-sm font-semibold">
                          {event.theme}
                        </div>
                      )}
                      <h3 className="text-3xl md:text-4xl font-bold">
                        {event.title}
                      </h3>
                      {event.short_description && (
                        <p className="text-blue-100 text-lg leading-relaxed">
                          {event.short_description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-blue-100">
                          <Calendar size={20} className="text-blue-300" />
                          <span className="font-semibold">{formatDate(startDate)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-100">
                          <Clock size={20} className="text-blue-300" />
                          <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
                        </div>
                        {event.venue_type === "physical" || event.venue_type === "hybrid" ? (
                          <div className="flex items-center gap-3 text-blue-100">
                            <MapPin size={20} className="text-blue-300" />
                            <span>
                              {event.venue_address || event.venue_city || "Physical Event"}
                              {event.venue_city && `, ${event.venue_city}`}
                              {event.venue_state && `, ${event.venue_state}`}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-blue-100">
                            <Globe size={20} className="text-blue-300" />
                            <span>Online Event</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-700/50 rounded-full text-sm font-medium capitalize">
                            {event.event_type}
                          </span>
                          <span className="px-3 py-1 bg-blue-700/50 rounded-full text-sm font-medium capitalize">
                            {event.venue_type}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                          to={`/events/${event.id}`}
                          className="flex-1 px-8 py-4 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Ticket size={20} />
                          Get Your Ticket
                        </Link>
                        <Link
                          to={`/events/${event.id}`}
                          className="flex-1 px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                          View Details
                          <ArrowRight size={20} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* 4. FEATURED PROPERTIES */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-slate-600 text-lg">
                Discover premium real estate opportunities
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  {property.primary_image_url ? (
                    <img
                      src={property.primary_image_url}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                      <Building2 size={48} className="text-slate-400" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    <p className="text-2xl font-bold text-blue-800 mb-3">
                      {property.currency} {property.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      {property.bedrooms && <span>{property.bedrooms} Beds</span>}
                      {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                      {property.square_feet && <span>{property.square_feet} sqft</span>}
                    </div>
                    <p className="text-sm text-slate-600">
                      {property.address}, {property.city}, {property.state}
                    </p>
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-800 rounded">
                        {property.listing_type}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-800 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                View All Properties
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. UPCOMING LIVE PODCASTS */}
      {featuredPodcasts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Upcoming Live Podcasts
              </h2>
              <p className="text-slate-600 text-lg">
                Join industry experts for live discussions and insights
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPodcasts.map((podcast) => (
                <Link
                  key={podcast.id}
                  to={`/podcasts/${podcast.id}`}
                  className="bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
                >
                  {podcast.thumbnail_url ? (
                    <img
                      src={podcast.thumbnail_url}
                      alt={podcast.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-48 bg-blue-100 flex items-center justify-center">
                      <Mic2 size={48} className="text-blue-400" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {podcast.title}
                    </h3>
                    {podcast.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {podcast.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Play size={16} />
                      <span>Listen Now</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/podcasts"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-800 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                View All Podcasts
                <ArrowRight size={18} />
              </Link>
            </div>
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
    </>
  );
}
