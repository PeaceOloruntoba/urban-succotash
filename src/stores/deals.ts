import { create } from 'zustand';
import { api } from '../lib/axios';

export interface Deal {
  id: string;
  realtor_id: string;
  property_id: string;
  client_name: string;
  deal_value: number;
  transaction_date: string;
  payment_status: string;
  realtor_name?: string;
  property_name?: string;
  total_commission_amount?: number;
  realtor_share_amount?: number;
  commission_status?: string;
}

interface DealState {
  deals: Deal[];
  loading: boolean;
  fetchDeals: () => Promise<void>;
  createDeal: (deal: Partial<Deal>) => Promise<Deal>;
  updateCommissionStatus: (dealId: string, status: string) => Promise<void>;
}

export const useDealStore = create<DealState>((set, get) => ({
  deals: [],
  loading: false,
  fetchDeals: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/deals');
      set({ deals: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  createDeal: async (deal) => {
    const response = await api.post('/deals', deal);
    set((state) => ({ deals: [response.data, ...state.deals] }));
    return response.data;
  },
  updateCommissionStatus: async (dealId, status) => {
    await api.patch(`/deals/${dealId}/commission`, { status });
    get().fetchDeals();
  },
}));
