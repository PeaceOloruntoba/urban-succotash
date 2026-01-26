import { create } from "zustand";
import { api } from "../lib/axios";

export type Property = {
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
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  listing_type: string;
  featured: boolean;
  primary_image_url?: string | null;
};

type PropertiesState = {
  properties: Property[];
  featuredProperties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: (filters?: any) => Promise<void>;
  fetchFeaturedProperties: (limit?: number) => Promise<void>;
  getPropertyById: (id: string) => Property | null;
};

export const usePropertiesStore = create<PropertiesState>((set, get) => ({
  properties: [],
  featuredProperties: [],
  loading: false,
  error: null,
  fetchProperties: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/properties", { params: filters });
      set({ properties: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchFeaturedProperties: async (limit = 6) => {
    set({ loading: true });
    try {
      const res = await api.get("/properties", {
        params: { featured: true, limit, status: "available" },
      });
      set({ featuredProperties: res.data?.data?.items || [], loading: false });
    } catch (err: any) {
      set({ loading: false });
    }
  },
  getPropertyById: (id: string) => {
    const { properties, featuredProperties } = get();
    return (
      properties.find((p) => p.id === id) ||
      featuredProperties.find((p) => p.id === id) ||
      null
    );
  },
}));
