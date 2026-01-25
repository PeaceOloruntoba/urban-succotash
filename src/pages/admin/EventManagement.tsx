import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import { X, Upload, Trash2, Save } from "lucide-react";

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
  venue_type: string;
  venue_address: string | null;
  venue_city: string | null;
  venue_state: string | null;
  online_platform: string | null;
  online_link: string | null;
  status: string;
  featured: boolean;
};

type EventImage = {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
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
  social_media?: Array<{ platform_name: string; url: string }>;
};

type Ticket = {
  id: string;
  name: string;
  price: number;
  is_free: boolean;
  category_name: string | null;
};

export default function EventManagement() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  console.log(event);
  const [images, setImages] = useState<EventImage[]>([]);
  const [speakers, setSpeakers] = useState<EventSpeaker[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "images" | "speakers" | "tickets" | "coupons">("details");

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    description: "",
    shortDescription: "",
    eventType: "conference",
    eventTypeNew: "physical",
    startDate: "",
    endDate: "",
    timezone: "Africa/Lagos",
    venueType: "physical",
    venueAddress: "",
    venueCity: "",
    venueState: "",
    venueCountry: "Nigeria",
    onlinePlatform: "",
    onlineLink: "",
    status: "draft",
    featured: false,
  });

  const [newImage, setNewImage] = useState<{ base64: string; isThumbnail: boolean } | null>(null);
  const [newSpeaker, setNewSpeaker] = useState({
    name: "",
    occupation: "",
    company: "",
    location: "",
    description: "",
    topic: "",
    imageBase64: "",
    socialMedia: [] as Array<{ platformName: string; url: string }>,
  });
  const [newTicket, setNewTicket] = useState({
    name: "",
    description: "",
    price: "0",
    categoryName: "",
    quantityAvailable: "",
    maxPerUser: "",
    isFree: false,
  });
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxUses: "",
    validUntil: "",
  });

  useEffect(() => {
    if (id) {
      loadEvent();
    } else {
      // Creating new event - set loading to false
      setLoading(false);
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

      if (eventData) {
        setFormData({
          title: eventData.title || "",
          theme: eventData.theme || "",
          description: eventData.description || "",
          shortDescription: eventData.short_description || "",
          eventType: eventData.event_type || "conference",
          eventTypeNew: eventData.event_type_new || "physical",
          startDate: eventData.start_date ? new Date(eventData.start_date).toISOString().slice(0, 16) : "",
          endDate: eventData.end_date ? new Date(eventData.end_date).toISOString().slice(0, 16) : "",
          timezone: eventData.timezone || "Africa/Lagos",
          venueType: eventData.venue_type || "physical",
          venueAddress: eventData.venue_address || "",
          venueCity: eventData.venue_city || "",
          venueState: eventData.venue_state || "",
          venueCountry: eventData.venue_country || "Nigeria",
          onlinePlatform: eventData.online_platform || "",
          onlineLink: eventData.online_link || "",
          status: eventData.status || "draft",
          featured: eventData.featured || false,
        });
      }
    } catch (err: any) {
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    try {
      if (!formData.title || !formData.startDate || !formData.endDate) {
        toast.error("Please fill in all required fields (title, start date, end date)");
        return;
      }

      setSaving(true);
      
      // Map form data to backend expected format
      const payload: any = {
        title: formData.title,
        theme: formData.theme || undefined,
        description: formData.description || undefined,
        shortDescription: formData.shortDescription || undefined,
        eventType: formData.eventType,
        eventTypeNew: formData.eventTypeNew,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        timezone: formData.timezone,
        venueType: formData.eventTypeNew === "virtual" ? "online" : formData.eventTypeNew === "hybrid" ? "hybrid" : "physical",
        venueAddress: formData.venueAddress || undefined,
        venueCity: formData.venueCity || undefined,
        venueState: formData.venueState || undefined,
        venueCountry: formData.venueCountry || undefined,
        onlinePlatform: formData.onlinePlatform || undefined,
        onlineLink: formData.onlineLink || undefined,
        status: formData.status,
        featured: formData.featured,
      };

      if (id) {
        await api.patch(`/events/${id}`, payload);
        toast.success("Event updated");
        loadEvent();
      } else {
        const res = await api.post("/events", payload);
        toast.success("Event created successfully!");
        const eventId = res.data?.data?.item?.id || res.data?.data?.id;
        if (eventId) {
          window.location.href = `/admin/events/${eventId}`;
        } else {
          toast.error("Event created but could not redirect. Please refresh the page.");
        }
      }
    } catch (err: any) {
      console.error("Event save error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImage || !id) return;
    try {
      await api.post(`/events/${id}/images`, {
        imageBase64: newImage.base64,
        isThumbnail: newImage.isThumbnail,
      });
      toast.success("Image added");
      setNewImage(null);
      loadEvent();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add image");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/events/${id}/images/${imageId}`);
      toast.success("Image deleted");
      loadEvent();
    } catch (err: any) {
      toast.error("Failed to delete image");
    }
  };

  const handleAddSpeaker = async () => {
    if (!id) {
      toast.error("Please create the event first");
      return;
    }
    if (!newSpeaker.name || !newSpeaker.description) {
      toast.error("Name and description are required");
      return;
    }
    try {
      // Filter out empty social media entries
      const validSocialMedia = newSpeaker.socialMedia.filter(
        (sm) => sm.platformName && sm.url
      );
      
      await api.post(`/events/${id}/speakers`, {
        name: newSpeaker.name,
        occupation: newSpeaker.occupation || undefined,
        company: newSpeaker.company || undefined,
        location: newSpeaker.location || undefined,
        description: newSpeaker.description,
        topic: newSpeaker.topic || undefined,
        imageBase64: newSpeaker.imageBase64 || undefined,
        socialMedia: validSocialMedia.length > 0 ? validSocialMedia : undefined,
      });
      toast.success("Speaker added successfully!");
      setNewSpeaker({
        name: "",
        occupation: "",
        company: "",
        location: "",
        description: "",
        topic: "",
        imageBase64: "",
        socialMedia: [],
      });
      loadEvent();
    } catch (err: any) {
      console.error("Add speaker error:", err);
      toast.error(err.response?.data?.message || "Failed to add speaker");
    }
  };

  const handleDeleteSpeaker = async (speakerId: string) => {
    if (!confirm("Delete this speaker?")) return;
    try {
      await api.delete(`/events/${id}/speakers/${speakerId}`);
      toast.success("Speaker deleted");
      loadEvent();
    } catch (err: any) {
      toast.error("Failed to delete speaker");
    }
  };

  const handleAddTicket = async () => {
    if (!newTicket.name || !id) return;
    try {
      await api.post(`/events/${id}/tickets`, {
        ...newTicket,
        price: Number(newTicket.price),
        quantityAvailable: newTicket.quantityAvailable ? Number(newTicket.quantityAvailable) : undefined,
        maxPerUser: newTicket.maxPerUser ? Number(newTicket.maxPerUser) : undefined,
      });
      toast.success("Ticket added");
      setNewTicket({
        name: "",
        description: "",
        price: "0",
        categoryName: "",
        quantityAvailable: "",
        maxPerUser: "",
        isFree: false,
      });
      loadEvent();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add ticket");
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discountValue || !id) return;
    try {
      await api.post(`/events/${id}/coupons`, {
        ...newCoupon,
        discountValue: Number(newCoupon.discountValue),
        maxUses: newCoupon.maxUses ? Number(newCoupon.maxUses) : undefined,
      });
      toast.success("Coupon created");
      setNewCoupon({
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxUses: "",
        validUntil: "",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewImage({
        base64: reader.result as string,
        isThumbnail: images.length === 0,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSpeakerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewSpeaker({ ...newSpeaker, imageBase64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            {id ? "Edit Event" : "Create New Event"}
          </h1>
          <Link to="/admin/super" className="text-blue-800 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
          {(["details", "images", "speakers", "tickets", "coupons"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-blue-800 border-b-2 border-blue-800"
                  : "text-slate-600 hover:text-blue-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Event Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Theme</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="e.g., Innovation & Technology"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Event Type *</label>
                <select
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                >
                  <option value="conference">Conference</option>
                  <option value="webinar">Webinar</option>
                  <option value="workshop">Workshop</option>
                  <option value="summit">Summit</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Venue Type *</label>
                <select
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  value={formData.eventTypeNew}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      eventTypeNew: e.target.value,
                      venueType: e.target.value === "virtual" ? "online" : e.target.value === "hybrid" ? "hybrid" : "physical",
                    });
                  }}
                >
                  <option value="virtual">Virtual</option>
                  <option value="physical">Physical</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              {formData.eventTypeNew !== "virtual" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Venue Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                      value={formData.venueAddress}
                      onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                      value={formData.venueCity}
                      onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                      value={formData.venueState}
                      onChange={(e) => setFormData({ ...formData, venueState: e.target.value })}
                    />
                  </div>
                </>
              )}
              {formData.eventTypeNew !== "physical" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Online Platform</label>
                    <select
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                      value={formData.onlinePlatform}
                      onChange={(e) => setFormData({ ...formData, onlinePlatform: e.target.value })}
                    >
                      <option value="">Select Platform</option>
                      <option value="zoom">Zoom</option>
                      <option value="meet">Google Meet</option>
                      <option value="teams">Microsoft Teams</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
              <textarea
                rows={2}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief description for listings..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description * (At least 4 paragraphs)</label>
              <textarea
                rows={12}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800 font-mono text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed description with at least 4 paragraphs..."
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Use HTML tags for formatting. Minimum 4 paragraphs required.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-blue-800 rounded"
                />
                <span className="font-semibold">Featured Event</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <select
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <button
              onClick={handleSaveEvent}
              disabled={saving}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {saving ? "Saving..." : id ? "Update Event" : "Create Event"}
            </button>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === "images" && !id && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">
                Please create the event first before adding images.
              </p>
              <p className="text-slate-500 text-sm">
                Fill in the event details and click "Create Event" to get started.
              </p>
            </div>
          </div>
        )}
        {activeTab === "images" && id && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Event Images</h2>
              <p className="text-slate-600 mb-4">
                Add at least 4 images. One will be used as the thumbnail/cover.
              </p>

              {/* Add Image */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload size={32} className="text-slate-400 mb-2" />
                  <span className="text-slate-600">Click to upload image</span>
                </label>
                {newImage && (
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={newImage.base64}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newImage.isThumbnail}
                          onChange={(e) =>
                            setNewImage({ ...newImage, isThumbnail: e.target.checked })
                          }
                        />
                        <span>Use as thumbnail/cover</span>
                      </label>
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleAddImage} className="btn btn-primary">
                          Add Image
                        </button>
                        <button
                          onClick={() => setNewImage(null)}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    {img.is_thumbnail && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-blue-800 text-white text-xs font-semibold rounded z-10">
                        Thumbnail
                      </span>
                    )}
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Speakers Tab */}
        {activeTab === "speakers" && !id && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">
                Please create the event first before adding speakers.
              </p>
              <p className="text-slate-500 text-sm">
                Fill in the event details and click "Create Event" to get started.
              </p>
            </div>
          </div>
        )}
        {activeTab === "speakers" && id && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Event Speakers</h2>

            {/* Add Speaker Form */}
            <div className="border-2 border-slate-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Add New Speaker</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name *"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newSpeaker.name}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Occupation"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newSpeaker.occupation}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, occupation: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newSpeaker.company}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, company: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newSpeaker.location}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, location: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Topic"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg md:col-span-2"
                  value={newSpeaker.topic}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, topic: e.target.value })}
                />
              </div>
              <textarea
                rows={4}
                placeholder="Description (at least 2 paragraphs) *"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg"
                value={newSpeaker.description}
                onChange={(e) => setNewSpeaker({ ...newSpeaker, description: e.target.value })}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSpeakerImageUpload}
                  className="hidden"
                  id="speaker-image-upload"
                />
                <label
                  htmlFor="speaker-image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
                >
                  <Upload size={20} />
                  Upload Speaker Image
                </label>
                {newSpeaker.imageBase64 && (
                  <img
                    src={newSpeaker.imageBase64}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full mt-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Social Media</label>
                <div className="space-y-2">
                  {newSpeaker.socialMedia.map((sm, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Platform (instagram, twitter, etc.)"
                        className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg"
                        value={sm.platformName}
                        onChange={(e) => {
                          const updated = [...newSpeaker.socialMedia];
                          updated[idx].platformName = e.target.value;
                          setNewSpeaker({ ...newSpeaker, socialMedia: updated });
                        }}
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg"
                        value={sm.url}
                        onChange={(e) => {
                          const updated = [...newSpeaker.socialMedia];
                          updated[idx].url = e.target.value;
                          setNewSpeaker({ ...newSpeaker, socialMedia: updated });
                        }}
                      />
                      <button
                        onClick={() => {
                          setNewSpeaker({
                            ...newSpeaker,
                            socialMedia: newSpeaker.socialMedia.filter((_, i) => i !== idx),
                          });
                        }}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setNewSpeaker({
                        ...newSpeaker,
                        socialMedia: [...newSpeaker.socialMedia, { platformName: "", url: "" }],
                      });
                    }}
                    className="text-blue-800 hover:underline text-sm"
                  >
                    + Add Social Media
                  </button>
                </div>
              </div>
              <button onClick={handleAddSpeaker} className="btn btn-primary">
                Add Speaker
              </button>
            </div>

            {/* Speakers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="border-2 border-slate-200 rounded-lg p-4">
                  <div className="flex gap-4">
                    {speaker.image_url ? (
                      <img
                        src={speaker.image_url}
                        alt={speaker.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 font-bold">
                          {speaker.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{speaker.name}</h4>
                      {speaker.occupation && <p className="text-blue-800">{speaker.occupation}</p>}
                      {speaker.company && <p className="text-slate-600 text-sm">{speaker.company}</p>}
                      {speaker.topic && (
                        <p className="text-sm font-semibold text-blue-800 mt-1">Topic: {speaker.topic}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSpeaker(speaker.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && id && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Event Tickets</h2>

            {/* Add Ticket Form */}
            <div className="border-2 border-slate-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Add New Ticket</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ticket Name *"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newTicket.name}
                  onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category (VIP, Executive, General, etc.)"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newTicket.categoryName}
                  onChange={(e) => setNewTicket({ ...newTicket, categoryName: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price (0 for free)"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newTicket.price}
                  onChange={(e) => setNewTicket({ ...newTicket, price: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Quantity Available"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newTicket.quantityAvailable}
                  onChange={(e) => setNewTicket({ ...newTicket, quantityAvailable: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max Per User"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newTicket.maxPerUser}
                  onChange={(e) => setNewTicket({ ...newTicket, maxPerUser: e.target.value })}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTicket.isFree}
                    onChange={(e) => setNewTicket({ ...newTicket, isFree: e.target.checked, price: e.target.checked ? "0" : newTicket.price })}
                  />
                  <span>Free Ticket (Registration Required)</span>
                </label>
              </div>
              <textarea
                rows={2}
                placeholder="Ticket Description"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
              <button onClick={handleAddTicket} className="btn btn-primary">
                Add Ticket
              </button>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border-2 border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">{ticket.name}</h4>
                      {ticket.category_name && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          {ticket.category_name}
                        </span>
                      )}
                      {ticket.is_free && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600">
                      {ticket.is_free ? "Free Registration" : `₦${ticket.price.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && !id && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">
                Please create the event first before creating coupons.
              </p>
              <p className="text-slate-500 text-sm">
                Fill in the event details and click "Create Event" to get started.
              </p>
            </div>
          </div>
        )}
        {activeTab === "coupons" && id && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Coupon Codes</h2>

            {/* Add Coupon Form */}
            <div className="border-2 border-slate-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Create New Coupon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Coupon Code *"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg uppercase"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                />
                <select
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <input
                  type="number"
                  placeholder="Discount Value *"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max Uses (optional)"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg"
                  value={newCoupon.maxUses}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                />
                <input
                  type="datetime-local"
                  placeholder="Valid Until"
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg md:col-span-2"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                />
              </div>
              <button onClick={handleAddCoupon} className="btn btn-primary">
                Create Coupon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
