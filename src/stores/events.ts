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
};

type EventsState = {
  events: Event[];
  featuredEvents: Event[];
  upcomingEvents: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: (filters?: any) => Promise<void>;
  fetchFeaturedEvents: () => Promise<void>;
  fetchUpcomingEvents: (limit?: number) => Promise<void>;
  getEventById: (id: string) => Event | null;
};

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  featuredEvents: [],
  upcomingEvents: [],
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
    const { events, featuredEvents, upcomingEvents } = get();
    return (
      events.find((e) => e.id === id) ||
      featuredEvents.find((e) => e.id === id) ||
      upcomingEvents.find((e) => e.id === id) ||
      null
    );
  },
}));
