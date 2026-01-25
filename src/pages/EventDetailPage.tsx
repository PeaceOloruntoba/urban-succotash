import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { api } from "../lib/axios";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  event_type: string;
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

type Ticket = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  quantity_available: number | null;
  quantity_sold: number;
  max_per_user: number | null;
  sale_start_date: string | null;
  sale_end_date: string | null;
  is_active: boolean;
};

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
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

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data?.data?.item || null);
      setTickets(res.data?.data?.tickets || []);
    } catch (err: any) {
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

      const { authorizationUrl } = res.data?.data?.payment || {};
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        toast.success("Booking created! Please complete payment.");
        navigate(`/events/${id}/booking/${res.data?.data?.booking?.id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number, currency: string) => {
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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/events" className="text-blue-800 hover:underline mb-4 inline-block">
          ← Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {event.cover_image_url && (
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
            )}

            <div className="card mb-6">
              <h1 className="text-3xl font-bold text-blue-900 mb-4">{event.title}</h1>
              {event.description && (
                <div
                  className="prose max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Start Date</div>
                  <div className="font-semibold">{formatDate(event.start_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">End Date</div>
                  <div className="font-semibold">{formatDate(event.end_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Venue Type</div>
                  <div className="font-semibold capitalize">{event.venue_type}</div>
                </div>
                {event.venue_address && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Location</div>
                    <div className="font-semibold">
                      {event.venue_address}
                      {event.venue_city && `, ${event.venue_city}`}
                      {event.venue_state && `, ${event.venue_state}`}
                    </div>
                  </div>
                )}
                {event.online_link && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Online Link</div>
                    <a
                      href={event.online_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-800 hover:underline"
                    >
                      Join Online
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Book Tickets</h3>

              {tickets.length === 0 ? (
                <p className="text-slate-600">No tickets available</p>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  {/* Ticket Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Ticket
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                      value={selectedTicket?.id || ""}
                      onChange={(e) => {
                        const ticket = tickets.find((t) => t.id === e.target.value);
                        setSelectedTicket(ticket || null);
                        setQuantity(1);
                        setDiscount(0);
                        setCouponCode("");
                      }}
                      required
                    >
                      <option value="">Choose a ticket</option>
                      {tickets.map((ticket) => (
                        <option key={ticket.id} value={ticket.id}>
                          {ticket.name} - {formatPrice(ticket.price, ticket.currency)}
                          {ticket.quantity_available !== null &&
                            ` (${ticket.quantity_available - ticket.quantity_sold} left)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTicket && (
                    <>
                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={selectedTicket.max_per_user || undefined}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
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
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Coupon Code (optional)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                          />
                          <button
                            type="button"
                            onClick={validateCoupon}
                            className="btn btn-outline"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {/* Attendee Info */}
                      <div className="space-y-3 pt-4 border-t">
                        <input
                          type="text"
                          placeholder="Attendee Name"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                          value={bookingForm.attendeeName}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, attendeeName: e.target.value })
                          }
                          required
                        />
                        <input
                          type="email"
                          placeholder="Attendee Email"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                          value={bookingForm.attendeeEmail}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, attendeeEmail: e.target.value })
                          }
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Phone (optional)"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                          value={bookingForm.attendeePhone}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, attendeePhone: e.target.value })
                          }
                        />
                      </div>

                      {/* Total */}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span>{formatPrice(selectedTicket.price * quantity, selectedTicket.currency)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between mb-2 text-green-600">
                            <span>Discount:</span>
                            <span>-{formatPrice(discount, selectedTicket.currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span className="text-blue-800">
                            {formatPrice(totalAmount, selectedTicket.currency)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full btn btn-primary mt-4"
                        disabled={submitting}
                      >
                        {submitting ? "Processing..." : "Book Now"}
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
