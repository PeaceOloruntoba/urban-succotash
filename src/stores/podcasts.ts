import { create } from "zustand";
import { api } from "../lib/axios";

export type Podcast = {
  id: string;
  title: string;
  description: string | null;
  audio_url: string | null;
  cover_url: string | null;
  duration_sec: number | null;
  scheduled_at?: string | null;
  published_at?: string | null;
  status?: string;
  created_at: string;
};

type PodcastsState = {
  podcasts: Podcast[];
  featuredPodcasts: Podcast[];
  adminPodcasts: Podcast[];
  currentPodcast: Podcast | null;
  loading: boolean;
  error: string | null;
  // Public
  fetchPodcasts: (filters?: any) => Promise<void>;
  fetchFeaturedPodcasts: (limit?: number) => Promise<void>;
  getPodcastById: (id: string) => Podcast | null;
  fetchPodcastById: (id: string) => Promise<Podcast | null>;
  // Admin
  fetchAdminPodcasts: (filters?: any) => Promise<void>;
  fetchAdminPodcastById: (id: string) => Promise<Podcast | null>;
  createPodcast: (payload: {
    title: string;
    description?: string;
    audioUrl?: string;
    videoUrl?: string;
    audioBase64?: string;
    videoBase64?: string;
    coverBase64?: string;
    durationSec?: number;
    scheduledAt?: string | null;
    publishedAt?: string | null;
  }) => Promise<Podcast>;
  updatePodcast: (id: string, payload: Partial<{
    title: string;
    description: string;
    audioUrl: string;
    videoUrl: string;
    audioBase64: string;
    videoBase64: string;
    coverBase64: string;
    durationSec: number;
    scheduledAt: string | null;
  }>) => Promise<Podcast | null>;
  publishPodcast: (id: string) => Promise<Podcast | null>;
};

export const usePodcastsStore = create<PodcastsState>((set, get) => ({
  podcasts: [],
  featuredPodcasts: [],
  adminPodcasts: [],
  currentPodcast: null,
  loading: false,
  error: null,
  fetchPodcasts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/podcasts", { params: filters });
      set({ podcasts: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
    }
  },
  fetchFeaturedPodcasts: async (limit = 6) => {
    set({ loading: true });
    try {
      const res = await api.get("/podcasts", {
        params: { featured: true, limit, status: "published" },
      });
      set({ featuredPodcasts: res.data?.data?.items || [], loading: false });
    } catch {
      set({ loading: false });
    }
  },
  getPodcastById: (id: string) => {
    const { podcasts, featuredPodcasts, adminPodcasts } = get();
    return (
      podcasts.find((p) => p.id === id) ||
      featuredPodcasts.find((p) => p.id === id) ||
      adminPodcasts.find((p) => p.id === id) ||
      null
    );
  },
  fetchPodcastById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/podcasts/${id}`);
      const item = res.data?.data?.item || res.data?.data || null;
      set({ currentPodcast: item, loading: false });
      return item;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      return null;
    }
  },
  fetchAdminPodcasts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/podcasts/admin", { params: filters });
      set({ adminPodcasts: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
    }
  },
  fetchAdminPodcastById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/podcasts/${id}`);
      const item = res.data?.data?.item || res.data?.data || null;
      set({ currentPodcast: item, loading: false });
      return item;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      return null;
    }
  },
  createPodcast: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/podcasts", payload);
      const item = res.data?.data?.item || res.data?.data;
      set({ loading: false });
      return item;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  updatePodcast: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch(`/podcasts/${id}`, payload);
      const item = res.data?.data?.item || res.data?.data || null;
      set({ loading: false });
      return item;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      return null;
    }
  },
  publishPodcast: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/podcasts/${id}/publish`);
      const item = res.data?.data?.item || res.data?.data || null;
      set({ loading: false });
      return item;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      return null;
    }
  },
}));
