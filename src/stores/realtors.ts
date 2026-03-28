import { create } from 'zustand';
import { api } from '../lib/axios';

export interface Realtor {
  id: string;
  cid_number: string;
  full_name: string;
  phone_number: string;
  email: string;
  location: string;
  referral_source: string;
  created_at: string;
}

interface RealtorState {
  realtors: Realtor[];
  loading: boolean;
  fetchRealtors: () => Promise<void>;
  createRealtor: (realtor: Partial<Realtor>) => Promise<Realtor>;
}

export const useRealtorStore = create<RealtorState>((set) => ({
  realtors: [],
  loading: false,
  fetchRealtors: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/realtors');
      set({ realtors: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  createRealtor: async (realtor) => {
    const response = await api.post('/realtors', realtor);
    set((state) => ({ realtors: [response.data, ...state.realtors] }));
    return response.data;
  },
}));
