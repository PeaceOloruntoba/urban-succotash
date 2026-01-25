import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { api } from "../lib/axios";
import { toast } from "sonner";
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
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data?.data?.item || null);
      setImages(res.data?.data?.images || []);
      setFeatures(res.data?.data?.features || []);
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
      await api.post(`/properties/${id}/inquiry`, inquiryForm);
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

  const primaryImage = images.find((img) => img.is_primary) || images[0];

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
                <img
                  src={primaryImage.image_url}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-slate-200 rounded-lg flex items-center justify-center">
                  <span className="text-slate-400">No Image Available</span>
                </div>
              )}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.slice(1, 5).map((img) => (
                    <img
                      key={img.id}
                      src={img.image_url}
                      alt=""
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="card mb-6">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{property.title}</h1>
              <p className="text-2xl font-bold text-blue-800 mb-4">
                {formatPrice(property.price, property.currency)}
              </p>
              <p className="text-slate-600 mb-6">{property.description}</p>

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

            {/* Location */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <p className="text-slate-700">
                {property.address}
                {property.zip_code && `, ${property.zip_code}`}
                <br />
                {property.city}, {property.state}
              </p>
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
