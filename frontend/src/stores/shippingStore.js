import { create } from 'zustand';

const initialSelectedOrder = {
  sellerId: '',
  customerId: '',
  productId: '',
  quantity: 1,
  deliverySpeed: 'STANDARD',
};

export const useShippingStore = create((set) => ({
  // Master data
  sellers: [],
  products: [],
  customers: [],

  // Order selection
  selectedOrder: initialSelectedOrder,

  // Calculated result from backend
  shippingResult: null,

  // UI state
  loading: false,
  error: null,

  // Setters for master data (to be wired to API later)
  setSellers: (sellers) => set({ sellers }),
  setProducts: (products) => set({ products }),
  setCustomers: (customers) => set({ customers }),

  // Order selection helpers
  setSelectedOrder: (partial) =>
    set((state) => ({
      selectedOrder: { ...state.selectedOrder, ...partial },
    })),
  resetSelectedOrder: () => set({ selectedOrder: initialSelectedOrder }),

  // Shipping result helpers
  setShippingResult: (result) => set({ shippingResult: result }),
  clearShippingResult: () => set({ shippingResult: null }),

  // Error / loading
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
