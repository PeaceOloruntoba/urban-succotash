import { create } from "zustand";

export type User = { id: string; email: string; display_name?: string } | null;

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User;
  setTokens: (a: string | null, r: string | null) => void;
  setUser: (u: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  setTokens: (a, r) => {
    if (a) localStorage.setItem("accessToken", a);
    else localStorage.removeItem("accessToken");
    if (r) localStorage.setItem("refreshToken", r);
    else localStorage.removeItem("refreshToken");
    set({ accessToken: a, refreshToken: r });
  },
  setUser: (u) => set({ user: u }),
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ accessToken: null, refreshToken: null, user: null });
  },
  loadFromStorage: () => {
    const a = localStorage.getItem("accessToken");
    const r = localStorage.getItem("refreshToken");
    set({ accessToken: a, refreshToken: r });
  },
}));
