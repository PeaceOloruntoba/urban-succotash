import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { api } from "../lib/axios";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth";
import {
  Calendar,
  MapPin,
  Globe,
  Clock,
  Ticket,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  ExternalLink,
  CheckCircle,
  Lock,
} from "lucide-react";
import ShareButton from "../components/ShareButton";

type Event = {
  id: string;
  title: string;
  theme: string | null;
  description: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  event_type: string;
  event_type_new: string | null;
  start_date: string;
  end_date: string;
  timezone: string;
  venue_type: string;
  venue_address: string | null;
  venue_city: string | null;
  venue_state: string | null;
  venue_country: string | null;
  online_platform: string | null;
  online_link: string | null;
  status: string;
  featured: boolean;
};

type EventImage = {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
  display_order: number;
};

type EventSpeaker = {
  id: string;
  name: string;
  occupation: string | null;
  company: string | null;
  location: string | null;
  description: string;
  topic: string | null;
  image_url: string | null;
  social_media?: Array<{
    platform_name: string;
    url: string;
  }>;
};

type Ticket = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  quantity_available: number | null;
  quantity_sold: number;
  max_per_user: number | null;
  is_free: boolean;
  category_name: string | null;
};

const getSocialIcon = (platform: string) => {
  const name = platform.toLowerCase();
  if (name.includes("instagram")) return Instagram;
  if (name.includes("twitter") || name.includes("x")) return Twitter;
  if (name.includes("facebook")) return Facebook;
  if (name.includes("linkedin")) return Linkedin;
  if (name.includes("youtube")) return Youtube;
  return ExternalLink;
};

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<EventImage[]>([]);
  const [speakers, setSpeakers] = useState<EventSpeaker[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [bookingForm, setBookingForm] = useState({
    attendeeName: "",
    attendeeEmail: "",
    attendeePhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [virtualAccessLink, setVirtualAccessLink] = useState<string | null>(null);
  const [, setAccessToken] = useState<string | null>(null);
  const [, setCheckingAccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      const data = res.data?.data || {};
      
      // Handle response structure - getEventWithDetails returns { ...event, images, speakers, tickets }
      const eventData = data.id ? data : data.item || data;
      setEvent(eventData);
      setImages(data.images || []);
      setSpeakers(data.speakers || []);
      setTickets(data.tickets || []);
    } catch (err: any) {
      console.error("Load event error:", err);
      toast.error(err.response?.data?.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode || !selectedTicket) return;
    try {
      const res = await api.post(`/events/${id}/validate-coupon`, {
        code: couponCode,
        amount: selectedTicket.price * quantity,
      });
      setDiscount(res.data?.data?.discountAmount || 0);
      toast.success("Coupon applied!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
      setDiscount(0);
    }
  };

  const checkVirtualAccess = async () => {
    if (!id || !user) return;
    try {
      setCheckingAccess(true);
      // Check if user has paid booking and access for this event
      const accessRes = await api.get(`/events/${id}/my-access`);
      if (accessRes.data?.data?.hasAccess && accessRes.data?.data?.event?.online_link) {
        setVirtualAccessLink(accessRes.data.data.event.online_link);
        setAccessToken(accessRes.data.data.accessToken);
      }
    } catch (err: any) {
      // User doesn't have access yet
    } finally {
      setCheckingAccess(false);
    }
  };

  useEffect(() => {
    if (event && (event.venue_type === "online" || event.venue_type === "hybrid") && user) {
      checkVirtualAccess();
    }
  }, [event, user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) {
      toast.error("Please select a ticket");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post(`/events/${id}/bookings`, {
        ticketId: selectedTicket.id,
        couponCode: couponCode || undefined,
        quantity,
        ...bookingForm,
      });

      // Check if it's a free event
      if (res.data?.data?.isFree) {
        toast.success("Registration confirmed!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }

      const { authorizationUrl } = res.data?.data?.payment || {};
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        toast.success("Booking created! Please complete payment.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dateOnly: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalAmount = selectedTicket
    ? selectedTicket.price * quantity - discount
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Event not found</h2>
          <Link to="/events" className="text-blue-800 hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const startDate = formatDate(event.start_date);
  const endDate = formatDate(event.end_date);
  const thumbnail = images.find((img) => img.is_thumbnail) || images[0];
  const galleryImages = images.filter((img) => !img.is_thumbnail || images.length === 1);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Full-Width Image */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"></div>
        )}
        {/* Share Button Overlay */}
        <div className="absolute top-6 right-6 z-10">
          <ShareButton
            url={`/events/${event.id}`}
            title={event.title}
            description={event.short_description || undefined}
            showQR={true}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <div className="max-w-3xl">
              {event.theme && (
                <div className="inline-block mb-4 px-4 py-2 bg-blue-800/90 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                  {event.theme}
                </div>
              )}
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                {event.title}
              </h1>
              {event.short_description && (
                <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                  {event.short_description}
                </p>
              )}
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span className="font-semibold">{startDate.full}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{startDate.time} - {endDate.time}</span>
                </div>
                {event.venue_type !== "online" && event.venue_address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={20} />
                    <span>{event.venue_city}, {event.venue_state}</span>
                  </div>
                )}
                {event.venue_type === "online" || event.venue_type === "hybrid" ? (
                  <div className="flex items-center gap-2">
                    <Globe size={20} />
                    <span className="capitalize">{event.venue_type}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Event Description */}
            {event.description && (
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">About This Event</h2>
                <div
                  className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Gallery</h2>
                <div className="space-y-4">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      src={galleryImages[activeImageIndex]?.image_url || galleryImages[0]?.image_url}
                      alt="Event gallery"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {galleryImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {galleryImages.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            activeImageIndex === idx
                              ? "border-blue-800 scale-105"
                              : "border-transparent hover:border-blue-300"
                          }`}
                        >
                          <img
                            src={img.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Speakers Section */}
            {speakers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {speakers.map((speaker) => {
                    // Handle both social_media array format and potential variations
                    const socialMedia = speaker.social_media || [];
                    const socialIcons = socialMedia
                      .filter((sm) => sm && sm.url && sm.platform_name)
                      .map((sm) => {
                        const Icon = getSocialIcon(sm.platform_name || "");
                        return { Icon, url: sm.url, name: sm.platform_name || "" };
                      });
                    return (
                      <div key={speaker.id} className="flex gap-6">
                        {speaker.image_url ? (
                          <img
                            src={speaker.image_url}
                            alt={speaker.name}
                            className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-blue-100"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Users size={32} className="text-blue-800" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{speaker.name}</h3>
                          {speaker.occupation && (
                            <p className="text-blue-800 font-semibold mb-1">{speaker.occupation}</p>
                          )}
                          {speaker.company && (
                            <p className="text-slate-600 text-sm mb-1">{speaker.company}</p>
                          )}
                          {speaker.location && (
                            <p className="text-slate-500 text-sm mb-3">{speaker.location}</p>
                          )}
                          {speaker.topic && (
                            <p className="text-sm font-semibold text-blue-800 mb-3">Topic: {speaker.topic}</p>
                          )}
                          <p className="text-slate-700 text-sm leading-relaxed mb-3 line-clamp-3">
                            {speaker.description}
                          </p>
                          {socialIcons && socialIcons.length > 0 && (
                            <div className="flex gap-2">
                              {socialIcons.map(({ Icon, url, name }, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-800 transition-colors"
                                  title={name}
                                >
                                  <Icon size={16} />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Event Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Date & Time</div>
                  <div className="font-semibold text-slate-900">
                    {startDate.full}
                    <br />
                    <span className="text-blue-800">{startDate.time} - {endDate.time}</span>
                  </div>
                </div>
                {event.venue_type !== "online" && event.venue_address && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Venue</div>
                    <div className="font-semibold text-slate-900">
                      {event.venue_address}
                      {event.venue_city && `, ${event.venue_city}`}
                      {event.venue_state && `, ${event.venue_state}`}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-slate-600 mb-1">Event Type</div>
                  <div className="font-semibold text-slate-900 capitalize">
                    {event.event_type_new || event.venue_type}
                  </div>
                </div>
                {event.online_platform && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Platform</div>
                    <div className="font-semibold text-slate-900 capitalize">
                      {event.online_platform}
                    </div>
                  </div>
                )}
                {(event.venue_type === "online" || event.venue_type === "hybrid") && (
                  <div className="md:col-span-2">
                    <div className="text-sm text-slate-600 mb-2">Virtual Access</div>
                    {virtualAccessLink ? (
                      <a
                        href={virtualAccessLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-colors font-semibold shadow-lg"
                      >
                        <Globe size={20} />
                        Join Online Event
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-xl border-2 border-slate-300">
                        <Lock size={20} className="text-slate-600" />
                        <div>
                          <div className="font-semibold text-slate-900">Protected Access</div>
                          <div className="text-sm text-slate-600">
                            Purchase a ticket to receive the virtual event link
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Get Your Ticket</h3>

              {tickets.length === 0 ? (
                <p className="text-slate-600">No tickets available</p>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  {/* Ticket Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Select Ticket
                    </label>
                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <button
                          key={ticket.id}
                          type="button"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setQuantity(1);
                            setDiscount(0);
                            setCouponCode("");
                          }}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            selectedTicket?.id === ticket.id
                              ? "border-blue-800 bg-blue-50"
                              : "border-slate-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              {ticket.category_name && (
                                <span className="inline-block mb-1 px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded">
                                  {ticket.category_name}
                                </span>
                              )}
                              <div className="font-bold text-slate-900">{ticket.name}</div>
                              {ticket.description && (
                                <div className="text-sm text-slate-600 mt-1">{ticket.description}</div>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xl font-bold text-blue-800">
                                {formatPrice(ticket.price, ticket.currency)}
                              </div>
                              {ticket.quantity_available !== null && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {ticket.quantity_available - ticket.quantity_sold} left
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedTicket && (
                    <>
                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={selectedTicket.max_per_user || undefined}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all"
                          value={quantity}
                          onChange={(e) => {
                            const qty = Math.max(1, Number(e.target.value));
                            setQuantity(qty);
                            if (couponCode) validateCoupon();
                          }}
                          required
                        />
                      </div>

                      {/* Coupon Code */}
                      {!selectedTicket.is_free && (
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Coupon Code (optional)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all uppercase"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="Enter code"
                            />
                            <button
                              type="button"
                              onClick={validateCoupon}
                              className="px-6 py-3 bg-blue-100 text-blue-800 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Attendee Info */}
                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all"
                          value={bookingForm.attendeeName}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, attendeeName: e.target.value })
                          }
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all"
                          value={bookingForm.attendeeEmail}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, attendeeEmail: e.target.value })
                          }
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number (optional)"
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all"
                          value={bookingForm.attendeePhone}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, attendeePhone: e.target.value })
                          }
                        />
                      </div>

                      {/* Total */}
                      {!selectedTicket.is_free && (
                        <div className="pt-4 border-t border-slate-200 space-y-2">
                          <div className="flex justify-between text-slate-600">
                            <span>Subtotal:</span>
                            <span>{formatPrice(selectedTicket.price * quantity, selectedTicket.currency)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-green-600 font-semibold">
                              <span>Discount:</span>
                              <span>-{formatPrice(discount, selectedTicket.currency)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-xl pt-2 border-t border-slate-200">
                            <span>Total:</span>
                            <span className="text-blue-800">
                              {formatPrice(totalAmount, selectedTicket.currency)}
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-4 bg-blue-800 text-white rounded-xl font-bold text-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                      >
                        {submitting ? (
                          "Processing..."
                        ) : selectedTicket.is_free ? (
                          <>
                            <CheckCircle size={20} />
                            Register for Free
                          </>
                        ) : (
                          <>
                            <Ticket size={20} />
                            Book Now
                          </>
                        )}
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
