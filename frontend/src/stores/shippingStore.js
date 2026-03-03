import { create } from 'zustand';
import { masterDataApi } from '../services/masterDataApi';
import { shippingApi } from '../services/shippingApi';

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
  setWarehouses: (warehouses) => set({ warehouses }),

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

  // API actions
  loadMasterData: async () => {
    set({ loading: true, error: null });
    try {
      const [sellers, customers, products, warehouses] = await Promise.all([
        masterDataApi.listSellers(),
        masterDataApi.listCustomers(),
        masterDataApi.listProducts(),
        masterDataApi.listWarehouses(),
      ]);
      
      // Auto-select first items
      const newSelectedOrder = {
        sellerId: sellers.length > 0 ? String(sellers[0].id) : '',
        customerId: customers.length > 0 ? String(customers[0].id) : '',
        productId: products.length > 0 ? String(products[0].id) : '',
        quantity: 1,
        deliverySpeed: 'STANDARD',
      };
      
      set({ 
        sellers, 
        customers, 
        products, 
        warehouses, 
        selectedOrder: newSelectedOrder,
        loading: false 
      });
    } catch (err) {
      set({ error: err?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  createSeller: async (payload) => {
    set({ loading: true, error: null });
    try {
      await masterDataApi.createSeller(payload);
      const sellers = await masterDataApi.listSellers();
      set({ sellers, loading: false });
    } catch (err) {
      set({ error: err?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  createCustomer: async (payload) => {
    set({ loading: true, error: null });
    try {
      await masterDataApi.createCustomer(payload);
      const customers = await masterDataApi.listCustomers();
      set({ customers, loading: false });
    } catch (err) {
      set({ error: err?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  createWarehouse: async (payload) => {
    set({ loading: true, error: null });
    try {
      await masterDataApi.createWarehouse(payload);
      const warehouses = await masterDataApi.listWarehouses();
      set({ warehouses, loading: false });
    } catch (err) {
      set({ error: err?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  createProduct: async (payload) => {
    set({ loading: true, error: null });
    try {
      await masterDataApi.createProduct(payload);
      const products = await masterDataApi.listProducts();
      set({ products, loading: false });
    } catch (err) {
      set({ error: err?.data?.error || err.message, loading: false });
      throw err;
    }
  },

  calculateShipping: async () => {
    set({ loading: true, error: null, shippingResult: null });
    try {
      const state = useShippingStore.getState();
      const o = state.selectedOrder;
      const result = await shippingApi.calculateSellerShipping({
        sellerId: Number(o.sellerId),
        customerId: Number(o.customerId),
        productId: Number(o.productId),
        quantity: Number(o.quantity),
        deliverySpeed: o.deliverySpeed,
      });
      set({ shippingResult: result, loading: false });
      return result;
    } catch (err) {
      set({ error: err?.data?.error || err.message, loading: false });
      throw err;
    }
  },
}));
