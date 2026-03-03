import { apiClient } from './apiClient';

export const shippingApi = {
  getNearestWarehouse: async ({ sellerId, productId }) => {
    const response = await apiClient.get('/v1/warehouse/nearest', {
      params: { sellerId, productId },
    });
    return response.data;
  },

  calculateShippingCharge: async ({
    warehouseId,
    customerId,
    productId,
    quantity,
    deliverySpeed,
  }) => {
    const response = await apiClient.get('/v1/shipping-charge', {
      params: {
        warehouseId,
        customerId,
        productId,
        quantity,
        deliverySpeed,
      },
    });
    return response.data;
  },

  calculateSellerShipping: async ({
    sellerId,
    customerId,
    productId,
    quantity,
    deliverySpeed,
  }) => {
    const response = await apiClient.post('/v1/shipping-charge/calculate', {
      sellerId,
      customerId,
      productId,
      quantity,
      deliverySpeed,
    });
    return response.data;
  },
};
