import { Link } from "react-router-dom";
import { Target, Shield, Sparkles, Twitter, Instagram, Linkedin } from "lucide-react";

export default function AboutPage() {
  type Socials = {
    x?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
  };
  type TeamMember = {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string | null;
    socials?: Socials;
  };
  const teamMembers: TeamMember[] = [
    {
      id: "ceo",
      name: "Amina Okoro",
      role: "Chief Executive Officer",
      avatarUrl: null,
      socials: { x: "https://x.com/", instagram: "https://instagram.com/", linkedin: "https://linkedin.com/" },
    },
    {
      id: "cto",
      name: "David Chen",
      role: "Chief Technology Officer",
      avatarUrl: null,
      socials: { x: "https://x.com/", linkedin: "https://linkedin.com/" },
    },
    {
      id: "coo",
      name: "Grace Mensah",
      role: "Chief Operating Officer",
      avatarUrl: null,
      socials: { linkedin: "https://linkedin.com/" },
    },
    {
      id: "hmkt",
      name: "Sofia Martins",
      role: "Head of Marketing",
      avatarUrl: null,
      socials: { x: "https://x.com/", instagram: "https://instagram.com/", linkedin: "https://linkedin.com/" },
    },
    {
      id: "hsales",
      name: "Kelechi Obi",
      role: "Head of Sales",
      avatarUrl: null,
      socials: { x: "https://x.com/", linkedin: "https://linkedin.com/" },
    },
  ];
  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About SafeNest</h1>
            <p className="text-blue-100 text-lg">
              SafeNest brings real estate, community, and knowledge together — empowering buyers, sellers, and creators
              through verified listings, live podcasts, and world-class events.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">Our Mission</h2>
            <p className="text-slate-600">
              To make property discovery, learning, and networking seamless for everyone, backed by trust and transparency.
            </p>
          </div>
          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">Our Promise</h2>
            <p className="text-slate-600">
              Verified listings, curated content, and safe transactions — with tools that put users first.
            </p>
          </div>
          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Sparkles size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">Our Vision</h2>
            <p className="text-slate-600">
              A global platform where real estate excellence meets community, education, and opportunity.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Leadership & Team</h2>
            <p className="text-slate-600">Meet the people guiding and growing SafeNest</p>
          </div>
          <div className="hidden md:block">
            <Link to="/" className="text-blue-800 hover:text-blue-900 font-semibold">Back to Home</Link>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((m) => (
            <div key={m.id} className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                {m.avatarUrl ? (
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    {getInitials(m.name)}
                  </div>
                )}
                <div>
                  <div className="text-lg font-semibold">{m.name}</div>
                  <div className="text-sm text-slate-600">{m.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {m.socials?.x && (
                  <a
                    href={m.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on X`}
                    className="p-2 rounded-full border hover:bg-slate-50 text-slate-700"
                  >
                    <Twitter size={16} />
                  </a>
                )}
                {m.socials?.instagram && (
                  <a
                    href={m.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on Instagram`}
                    className="p-2 rounded-full border hover:bg-slate-50 text-slate-700"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {m.socials?.linkedin && (
                  <a
                    href={m.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="p-2 rounded-full border hover:bg-slate-50 text-slate-700"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
