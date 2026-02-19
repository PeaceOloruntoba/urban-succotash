import { create } from "zustand";
import { api } from "../lib/axios";

export type Event = {
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
  featured: boolean;
  status?: string;
};

type EventsState = {
  events: Event[];
  featuredEvents: Event[];
  upcomingEvents: Event[];
  adminEvents: Event[];
  currentEventDetails: any | null;
  eventBookings: any[];
  exchangeRates: Record<string, number>;
  exchangeRatesBase: string | null;
  exchangeRatesFetchedAt: number | null;
  loading: boolean;
  error: string | null;
  // Public
  fetchEvents: (filters?: any) => Promise<void>;
  fetchFeaturedEvents: () => Promise<void>;
  fetchUpcomingEvents: (limit?: number) => Promise<void>;
  getEventById: (id: string) => Event | null;
  // Admin
  fetchAdminEvents: (filters?: any) => Promise<void>;
  fetchAdminEventById: (id: string) => Promise<any | null>;
  fetchEventBookings: (id: string) => Promise<void>;
  // Tickets
  createTicket: (eventId: string, payload: {
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    quantityAvailable?: number;
    maxPerUser?: number;
    saleStartDate?: string;
    saleEndDate?: string;
    displayOrder?: number;
    isFree?: boolean;
    categoryName?: string;
  }) => Promise<any>;
  updateTicket: (eventId: string, ticketId: string, payload: Partial<{
    name: string;
    description: string;
    price: number;
    quantityAvailable: number;
    maxPerUser: number;
    saleStartDate: string;
    saleEndDate: string;
    isActive: boolean;
    displayOrder: number;
    isFree: boolean;
    categoryName: string;
  }>) => Promise<any>;
  deleteTicket: (eventId: string, ticketId: string) => Promise<void>;
  // Coupons
  createCoupon: (eventId: string, payload: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxUses?: number;
    minPurchaseAmount?: number;
    validFrom?: string;
    validUntil?: string;
  }) => Promise<any>;
  // Speakers
  addSpeaker: (eventId: string, payload: {
    name: string;
    occupation?: string;
    company?: string;
    location?: string;
    description: string;
    topic?: string;
    imageUrl?: string;
    displayOrder?: number;
    socialMedia?: any[];
  }) => Promise<any>;
  deleteSpeaker: (eventId: string, speakerId: string) => Promise<void>;
  // Images
  addEventImage: (eventId: string, payload: {
    imageUrl?: string;
    isThumbnail?: boolean;
    displayOrder?: number;
  }) => Promise<any>;
  deleteEventImage: (eventId: string, imageId: string) => Promise<void>;
  // Currency
  fetchExchangeRates: (base?: string) => Promise<void>;
  convertAmount: (amount: number, from: string, to: string) => number | null;
  createEvent: (payload: {
    title: string;
    theme?: string;
    description?: string;
    shortDescription?: string;
    coverImageUrl?: string;
    eventType?: string;
    eventTypeNew?: string;
    startDate?: string;
    endDate?: string;
    timezone?: string;
    venueType?: string;
    venueAddress?: string;
    venueCity?: string;
    venueState?: string;
    venueCountry?: string;
    onlinePlatform?: string;
    onlineLink?: string;
    status?: string;
    featured?: boolean;
  }) => Promise<any>;
  updateEvent: (id: string, payload: Partial<{
    title: string;
    theme: string;
    description: string;
    shortDescription: string;
    coverImageUrl: string;
    eventType: string;
    eventTypeNew: string;
    startDate: string;
    endDate: string;
    timezone: string;
    venueType: string;
    venueAddress: string;
    venueCity: string;
    venueState: string;
    venueCountry: string;
    onlinePlatform: string;
    onlineLink: string;
    status: string;
    featured: boolean;
  }>) => Promise<any | null>;
};

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  featuredEvents: [],
  upcomingEvents: [],
  adminEvents: [],
  currentEventDetails: null,
  eventBookings: [],
  exchangeRates: {},
  exchangeRatesBase: null,
  exchangeRatesFetchedAt: null,
  loading: false,
  error: null,
  fetchEvents: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/events", { params: filters });
      set({ events: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchExchangeRates: async (base = "NGN") => {
    try {
      const now = Date.now();
      const { exchangeRatesBase, exchangeRatesFetchedAt } = get();
      if (exchangeRatesBase === base && exchangeRatesFetchedAt && now - exchangeRatesFetchedAt < 1000 * 60 * 30) {
        return;
      }
      const res = await fetch(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`);
      const json = await res.json();
      if (json && json.rates) {
        set({ exchangeRates: json.rates, exchangeRatesBase: base, exchangeRatesFetchedAt: now });
      }
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch exchange rates" });
    }
  },
  convertAmount: (amount, from, to) => {
    const { exchangeRates, exchangeRatesBase } = get();
    if (!exchangeRatesBase || Object.keys(exchangeRates).length === 0) return null;
    if (from === to) return amount;
    if (exchangeRatesBase === from) {
      const rate = exchangeRates[to];
      if (!rate) return null;
      return amount * rate;
    }
    const toRate = exchangeRates[to];
    const fromRate = exchangeRates[from];
    if (!toRate || !fromRate) return null;
    return amount * (toRate / fromRate);
  },
  fetchFeaturedEvents: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/events", {
        params: { featured: true, limit: 3, sortBy: "start_date", sortDir: "asc" },
      });
      set({ featuredEvents: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ loading: false });
    }
  },
  fetchUpcomingEvents: async (limit = 3) => {
    set({ loading: true });
    try {
      const now = new Date().toISOString();
      const res = await api.get("/events", {
        params: {
          status: "published",
          startDateFrom: now,
          limit,
          sortBy: "start_date",
          sortDir: "asc",
        },
      });
      set({ upcomingEvents: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ loading: false });
    }
  },
  getEventById: (id: string) => {
    const { events, featuredEvents, upcomingEvents, adminEvents } = get();
    return (
      events.find((e) => e.id === id) ||
      featuredEvents.find((e) => e.id === id) ||
      upcomingEvents.find((e) => e.id === id) ||
      adminEvents.find((e) => e.id === id) ||
      null
    );
  },
  fetchAdminEvents: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/events/admin/list", { params: filters });
      set({ adminEvents: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
    }
  },
  fetchAdminEventById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/events/${id}`);
      const details = res.data?.data || null;
      set({ currentEventDetails: details, loading: false });
      return details;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      return null;
    }
  },
  fetchEventBookings: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/events/${id}/bookings`);
      set({ eventBookings: res.data?.data?.bookings || [], loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
    }
  },
  createTicket: async (eventId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/events/${eventId}/tickets`, {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        currency: payload.currency,
        quantityAvailable: payload.quantityAvailable,
        maxPerUser: payload.maxPerUser,
        saleStartDate: payload.saleStartDate,
        saleEndDate: payload.saleEndDate,
        displayOrder: payload.displayOrder,
        isFree: payload.isFree,
        categoryName: payload.categoryName,
      });
      set({ loading: false });
      return res.data?.data?.ticket || res.data?.data;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  updateTicket: async (eventId, ticketId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch(`/events/${eventId}/tickets/${ticketId}`, {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        quantityAvailable: payload.quantityAvailable,
        maxPerUser: payload.maxPerUser,
        saleStartDate: payload.saleStartDate,
        saleEndDate: payload.saleEndDate,
        isActive: payload.isActive,
        displayOrder: payload.displayOrder,
        isFree: payload.isFree,
        categoryName: payload.categoryName,
      });
      set({ loading: false });
      return res.data?.data?.ticket || res.data?.data;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  deleteTicket: async (eventId, ticketId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/events/${eventId}/tickets/${ticketId}`);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  createCoupon: async (eventId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/events/${eventId}/coupons`, payload);
      set({ loading: false });
      return res.data?.data?.coupon || res.data?.data;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  addSpeaker: async (eventId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/events/${eventId}/speakers`, payload);
      set({ loading: false });
      return res.data?.data?.speaker || res.data?.data;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  deleteSpeaker: async (eventId, speakerId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/events/${eventId}/speakers/${speakerId}`);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  addEventImage: async (eventId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/events/${eventId}/images`, {
        imageUrl: payload.imageUrl,
        isThumbnail: payload.isThumbnail === true,
        displayOrder: payload.displayOrder ?? 0,
      });
      set({ loading: false });
      return res.data?.data?.image || res.data?.data;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  deleteEventImage: async (eventId, imageId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/events/${eventId}/images/${imageId}`);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  createEvent: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/events", payload);
      const item = res.data?.data?.item || res.data?.data;
      set({ loading: false });
      return item;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  updateEvent: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch(`/events/${id}`, payload);
      const item = res.data?.data?.item || res.data?.data || null;
      set({ loading: false });
      return item;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      return null;
    }
  },
}));
