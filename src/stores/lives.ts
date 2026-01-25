import { create } from "zustand";
import { api } from "../lib/axios";

export type LiveSession = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  status: string;
  is_live: boolean;
  scheduled_start: string | null;
  started_at: string | null;
  viewer_count: number;
};

type LivesState = {
  liveSessions: LiveSession[];
  currentLive: LiveSession | null;
  loading: boolean;
  error: string | null;
  fetchLiveSessions: () => Promise<void>;
  getLiveById: (id: string) => LiveSession | null;
  setCurrentLive: (live: LiveSession | null) => void;
};

export const useLivesStore = create<LivesState>((set, get) => ({
  liveSessions: [],
  currentLive: null,
  loading: false,
  error: null,
  fetchLiveSessions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/live/sessions");
      set({ liveSessions: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  getLiveById: (id: string) => {
    const { liveSessions } = get();
    return liveSessions.find((l) => l.id === id) || null;
  },
  setCurrentLive: (live) => set({ currentLive: live }),
}));
