import { create } from "zustand";
import { api } from "../lib/axios";

export type Podcast = {
  id: string;
  title: string;
  description: string | null;
  audio_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  status: string;
  featured: boolean;
  created_at: string;
};

type PodcastsState = {
  podcasts: Podcast[];
  featuredPodcasts: Podcast[];
  loading: boolean;
  error: string | null;
  fetchPodcasts: (filters?: any) => Promise<void>;
  fetchFeaturedPodcasts: (limit?: number) => Promise<void>;
  getPodcastById: (id: string) => Podcast | null;
};

export const usePodcastsStore = create<PodcastsState>((set, get) => ({
  podcasts: [],
  featuredPodcasts: [],
  loading: false,
  error: null,
  fetchPodcasts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/podcasts", { params: filters });
      set({ podcasts: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchFeaturedPodcasts: async (limit = 6) => {
    set({ loading: true });
    try {
      const res = await api.get("/podcasts", {
        params: { featured: true, limit, status: "published" },
      });
      set({ featuredPodcasts: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ loading: false });
    }
  },
  getPodcastById: (id: string) => {
    const { podcasts, featuredPodcasts } = get();
    return (
      podcasts.find((p) => p.id === id) ||
      featuredPodcasts.find((p) => p.id === id) ||
      null
    );
  },
}));
