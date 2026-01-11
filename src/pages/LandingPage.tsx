import React from "react";
import { Link } from "react-router";
import {
  Mic2,
  Radio,
  Play,
  Building2,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Globe,
  Calendar,
  Heart,
} from "lucide-react";

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-24 grid md:grid-cols-2 items-center gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Live Now: 1,240 people listening
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] text-slate-900">
            The Voice of{" "}
            <span className="text-blue-600">Modern Real Estate.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
            A premium hub where investors meet developers. Stream live market
            insights, browse elite listings, and join the conversation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/podcasts"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              <Play size={18} fill="currentColor" /> Explore Podcasts
            </Link>
            <Link
              to="/live"
              className="px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              See Live Sessions
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"
            alt="Modern Office"
            className="rounded-3xl shadow-2xl object-cover aspect-[4/5] md:aspect-square w-full"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block max-w-[240px]">
            <div className="flex gap-4 items-center">
              <div className="bg-blue-600 p-3 rounded-lg text-white">
                <Mic2 size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Top Creator
                </p>
                <p className="font-bold text-slate-800">Sarah Jenkins</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / STATS BAR */}
      <section className="bg-slate-50 border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-900">$2.4B+</div>
            <div className="text-sm text-gray-500">Asset Value Managed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900">50k+</div>
            <div className="text-sm text-gray-500">Active Investors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900">120+</div>
            <div className="text-sm text-gray-500">Live Weekly Shows</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900">98%</div>
            <div className="text-sm text-gray-500">Expert Satisfaction</div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPS */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">
            Built for the Industry
          </h2>
          <p className="text-gray-500 mt-2">
            Everything you need to stay ahead of the market.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Streaming</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with developers from Dubai to New York. Join live town
              halls and Q&A sessions from anywhere.
            </p>
          </div>
          <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Verified Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Our speakers are vetted realtors and developers with proven track
              records in the real estate sector.
            </p>
          </div>
          <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Market Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Get the data behind the deals. Downloadable reports and session
              notes provided with every podcast.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LIVE & UPCOMING (ENHANCED) */}
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
                  with Admin & Special Guests from Knight Frank
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  to="/live/listen"
                  className="px-6 py-3 bg-blue-600 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-colors"
                >
                  Join Stream
                </Link>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-slate-800"
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="user"
                    />
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
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] -z-0"></div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl shadow-blue-200">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to join the inner circle?
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Get exclusive access to recorded sessions, property pitch decks, and
            a network of global investors.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 border-2 border-blue-400 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xl">
            <Building2 className="text-blue-600" /> EstateStream
          </div>
          <div className="flex gap-8 text-gray-500 text-sm">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Advertising
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Help Center
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 EstateStream Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
