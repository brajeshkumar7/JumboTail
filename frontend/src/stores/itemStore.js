import { create } from 'zustand';
import { api } from '../utils/api';

export const useItemStore = create((set, get) => ({
  items: [],
  currentItem: null,
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await api.get('/items');
      set({ items, loading: false });
      return items;
    } catch (err) {
      set({ error: err.message || 'Failed to fetch items', loading: false });
      throw err;
    }
  },

  fetchItem: async (id) => {
    set({ loading: true, error: null });
    try {
      const currentItem = await api.get(`/items/${id}`);
      set({ currentItem, loading: false });
      return currentItem;
    } catch (err) {
      set({ error: err.message || 'Failed to fetch item', loading: false });
      throw err;
    }
  },

  createItem: async (data) => {
    set({ loading: true, error: null });
    try {
      const item = await api.post('/items', data);
      set((state) => ({ items: [item, ...state.items], loading: false }));
      return item;
    } catch (err) {
      set({ error: err.message || 'Failed to create item', loading: false });
      throw err;
    }
  },

  updateItem: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const item = await api.put(`/items/${id}`, data);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? item : i)),
        currentItem: state.currentItem?.id === id ? item : state.currentItem,
        loading: false,
      }));
      return item;
    } catch (err) {
      set({ error: err.message || 'Failed to update item', loading: false });
      throw err;
    }
  },

  deleteItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/items/${id}`);
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        currentItem: state.currentItem?.id === id ? null : state.currentItem,
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to delete item', loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentItem: () => set({ currentItem: null }),
}));
