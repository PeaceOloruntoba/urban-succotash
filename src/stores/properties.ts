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
  country: string;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  year_built: number | null;
  listing_type: string;
  featured: boolean;
  primary_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PropertyImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
};

export type PropertyFeature = {
  id: number;
  feature_name: string;
};

export type PropertyContact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  created_at: string;
};

type PropertiesState = {
  properties: Property[];
  featuredProperties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: (filters?: any) => Promise<void>;
  fetchFeaturedProperties: (limit?: number) => Promise<void>;
  getPropertyById: (id: string) => Property | null;
  // Admin and detail states
  adminList: Property[];
  adminLoading: boolean;
  propertyDetail: Property | null;
  propertyImages: PropertyImage[];
  propertyFeatures: PropertyFeature[];
  propertyContacts: PropertyContact[];
  fetchAdminList: (filters?: any) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  createProperty: (payload: any) => Promise<Property | null>;
  updateProperty: (id: string, payload: any) => Promise<Property | null>;
  fetchPropertyDetail: (id: string) => Promise<void>;
  fetchPropertyImages: (id: string) => Promise<void>;
  uploadPropertyImage: (id: string, body: { imageBase64?: string; imageUrl?: string; isPrimary?: boolean; displayOrder?: number }) => Promise<void>;
  setPrimaryImage: (id: string, imageUrl: string) => Promise<void>;
  deletePropertyImage: (id: string, imageId: string) => Promise<void>;
  fetchPropertyFeatures: (id: string) => Promise<void>;
  addPropertyFeature: (id: string, featureName: string) => Promise<void>;
  deletePropertyFeature: (id: string, featureId: number) => Promise<void>;
  fetchPropertyContacts: (id: string) => Promise<void>;
  submitInquiry: (id: string, body: { name: string; email: string; phone?: string; message?: string }) => Promise<void>;
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
  // Admin/detail
  adminList: [],
  adminLoading: false,
  propertyDetail: null,
  propertyImages: [],
  propertyFeatures: [],
  propertyContacts: [],
  fetchAdminList: async (filters = {}) => {
    set({ adminLoading: true, error: null });
    try {
      const res = await api.get("/properties/admin/list", { params: filters });
      set({ adminList: res.data?.data?.items || [], adminLoading: false });
    } catch (err: any) {
      set({ error: err.message, adminLoading: false });
    }
  },
  deleteProperty: async (id: string) => {
    await api.delete(`/properties/${id}`);
    set({ adminList: get().adminList.filter((p) => p.id !== id) });
  },
  createProperty: async (payload: any) => {
    const res = await api.post("/properties", payload);
    const item = res.data?.data?.item || null;
    return item;
  },
  updateProperty: async (id: string, payload: any) => {
    const res = await api.patch(`/properties/${id}`, payload);
    const item = res.data?.data?.item || null;
    set({ propertyDetail: item });
    return item;
  },
  fetchPropertyDetail: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/properties/${id}`);
      set({
        propertyDetail: res.data?.data?.item || null,
        propertyImages: res.data?.data?.images || [],
        propertyFeatures: res.data?.data?.features || [],
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchPropertyImages: async (id: string) => {
    const res = await api.get(`/properties/${id}/images`);
    set({ propertyImages: res.data?.data?.images || [] });
  },
  uploadPropertyImage: async (id: string, body) => {
    await api.post(`/properties/${id}/images`, body);
    const res = await api.get(`/properties/${id}/images`);
    set({ propertyImages: res.data?.data?.images || [] });
  },
  setPrimaryImage: async (id: string, imageUrl: string) => {
    await api.post(`/properties/${id}/images`, { imageUrl, isPrimary: true, displayOrder: 0 });
    const res = await api.get(`/properties/${id}/images`);
    set({ propertyImages: res.data?.data?.images || [] });
  },
  deletePropertyImage: async (id: string, imageId: string) => {
    await api.delete(`/properties/${id}/images/${imageId}`);
    set({ propertyImages: get().propertyImages.filter((img) => img.id !== imageId) });
  },
  fetchPropertyFeatures: async (id: string) => {
    const res = await api.get(`/properties/${id}/features`);
    set({ propertyFeatures: res.data?.data?.features || [] });
  },
  addPropertyFeature: async (id: string, featureName: string) => {
    await api.post(`/properties/${id}/features`, { featureName });
    const res = await api.get(`/properties/${id}/features`);
    set({ propertyFeatures: res.data?.data?.features || [] });
  },
  deletePropertyFeature: async (id: string, featureId: number) => {
    await api.delete(`/properties/${id}/features/${featureId}`);
    set({ propertyFeatures: get().propertyFeatures.filter((f) => f.id !== featureId) });
  },
  fetchPropertyContacts: async (id: string) => {
    const res = await api.get(`/properties/${id}/contacts`);
    set({ propertyContacts: res.data?.data?.contacts || [] });
  },
  submitInquiry: async (id: string, body) => {
    await api.post(`/properties/${id}/inquiry`, body);
  },
}));
