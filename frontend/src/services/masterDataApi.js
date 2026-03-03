import { apiClient } from './apiClient';

export const masterDataApi = {
  listSellers: async () => (await apiClient.get('/v1/sellers')).data,
  createSeller: async (payload) => (await apiClient.post('/v1/sellers', payload)).data,

  listCustomers: async () => (await apiClient.get('/v1/customers')).data,
  createCustomer: async (payload) => (await apiClient.post('/v1/customers', payload)).data,

  listProducts: async () => (await apiClient.get('/v1/products')).data,
  createProduct: async (payload) => (await apiClient.post('/v1/products', payload)).data,

  listWarehouses: async () => (await apiClient.get('/v1/warehouses')).data,
  createWarehouse: async (payload) => (await apiClient.post('/v1/warehouses', payload)).data,
};
