import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePropertiesStore } from "../stores/properties";
import { toast } from "sonner";
import { Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
// import { useAuthStore } from "../stores/auth";

type Property = {
  id: string;
  title: string;
  description: string | null;
  property_type: string;
  status: string;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  year_built: number | null;
  listing_type: string;
  featured: boolean;
  created_at: string;
};

type PropertyImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

type PropertyFeature = {
  id: number;
  feature_name: string;
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [features, setFeatures] = useState<PropertyFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [pois, setPOIs] = useState<any[]>([]);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const fetchPropertyDetail = usePropertiesStore.getState().fetchPropertyDetail;
      await fetchPropertyDetail(id!);
      const st = usePropertiesStore.getState();
      setProperty((st.propertyDetail as any) || null);
      setImages(st.propertyImages as any || []);
      setFeatures(st.propertyFeatures as any || []);
      setUnits(st.propertyUnits as any || []);
      setPlans(st.propertyPaymentPlans as any || []);
      setVideos(st.propertyVideos as any || []);
      setDocuments(st.propertyDocuments as any || []);
      setPOIs(st.propertyPOIs as any || []);
      const primaryIdx = (st.propertyImages || []).findIndex((img: PropertyImage) => img.is_primary);
      setActiveIndex(primaryIdx >= 0 ? primaryIdx : 0);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const submitInquiry = usePropertiesStore.getState().submitInquiry;
      await submitInquiry(id!, inquiryForm);
      toast.success("Inquiry submitted successfully!");
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Property not found</h2>
          <Link to="/properties" className="text-blue-800 hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = images[activeIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/properties" className="text-blue-800 hover:underline mb-4 inline-block">
          ← Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="card mb-6">
              {primaryImage ? (
                <div className="relative">
                  <img
                    src={primaryImage.image_url}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-lg cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                  />
                  <div className="absolute bottom-2 right-2 bg-white/60 text-blue-900 text-xs font-bold px-2 py-1 rounded">
                    SAFENEST
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 bg-slate-200 rounded-lg flex items-center justify-center">
                  <Building2 size={40} className="text-slate-400" />
                </div>
              )}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`View image ${idx + 1}`}
                      className={`relative flex-shrink-0 rounded ${activeIndex === idx ? "ring-2 ring-blue-800" : ""}`}
                    >
                      <img
                        src={img.image_url}
                        alt=""
                        className="w-24 h-20 object-cover rounded"
                      />
                      {img.is_primary && (
                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded">Primary</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {lightboxOpen && primaryImage && (
              <div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                onClick={() => setLightboxOpen(false)}
              >
                <div className="absolute top-4 right-4">
                  <button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded text-white"
                    aria-label="Close"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <button
                  className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded text-white"
                  aria-label="Previous"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <img
                  src={primaryImage.image_url}
                  alt=""
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded text-white"
                  aria-label="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((prev) => (prev + 1) % images.length);
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}

            {/* Property Details */}
            <div className="card mb-6">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{property.title}</h1>
              <p className="text-2xl font-bold text-blue-800 mb-4">
                {formatPrice(property.price, property.currency)}
              </p>
              {property.description && (
                <div className="prose max-w-none text-slate-700 mb-6" dangerouslySetInnerHTML={{ __html: property.description }} />
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div>
                    <div className="text-sm text-slate-600">Bedrooms</div>
                    <div className="text-lg font-semibold">{property.bedrooms}</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <div className="text-sm text-slate-600">Bathrooms</div>
                    <div className="text-lg font-semibold">{property.bathrooms}</div>
                  </div>
                )}
                {property.square_feet && (
                  <div>
                    <div className="text-sm text-slate-600">Square Feet</div>
                    <div className="text-lg font-semibold">{property.square_feet}</div>
                  </div>
                )}
                {property.year_built && (
                  <div>
                    <div className="text-sm text-slate-600">Year Built</div>
                    <div className="text-lg font-semibold">{property.year_built}</div>
                  </div>
                )}
              </div>

              {features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span
                        key={feature.id}
                        className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm"
                      >
                        {feature.feature_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {units.length > 0 && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold mb-3">Available Units</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {units.map((u) => (
                    <div key={u.id} className="p-4 border rounded-lg">
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-slate-600 text-sm mt-1">
                        {[u.bedrooms && `${u.bedrooms} bed`, u.bathrooms && `${u.bathrooms} bath`, u.square_feet && `${u.square_feet} sqft`].filter(Boolean).join(" · ")}
                      </div>
                      <div className="text-blue-800 font-bold mt-2">
                        {formatPrice(u.price, u.currency || "NGN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plans.length > 0 && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold mb-3">Payment Plans</h3>
                <div className="space-y-3">
                  {plans.map((p) => (
                    <div key={p.id} className="p-4 border rounded-lg">
                      <div className="font-semibold capitalize">{p.plan_type} {p.name ? `– ${p.name}` : ""}</div>
                      <div className="text-slate-600 text-sm mt-1">
                        {[p.down_payment_percent && `Down ${p.down_payment_percent}%`, p.tenure_months && `${p.tenure_months} months`, p.interest_rate_percent && `${p.interest_rate_percent}% interest`].filter(Boolean).join(" · ")}
                      </div>
                      {p.notes && <div className="text-sm text-slate-700 mt-1">{p.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold mb-3">Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((v) => (
                    <div key={v.id} className="aspect-video bg-black/5 rounded overflow-hidden">
                      <video src={v.video_url} controls className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold mb-3">Documents</h3>
                <ul className="list-disc pl-5 text-blue-800">
                  {documents.map((d) => (
                    <li key={d.id}>
                      <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {d.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <p className="text-slate-700">
                {property.address}
                {property.zip_code && `, ${property.zip_code}`}
                <br />
                {property.city}, {property.state}
              </p>
              {pois.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Neighborhood Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {pois.map((p) => (
                      <span key={p.id} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm">
                        {p.title}{p.distance_km ? ` • ${p.distance_km}km` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
              <form onSubmit={handleSubmitInquiry}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  />
                  <textarea
                    placeholder="Message (optional)"
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="w-full btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Send Inquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
