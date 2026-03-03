import { getNearestWarehouseForSeller } from './warehouseService.js';
import { calculateShippingCharge } from './shippingChargeService.js';

/**
 * Orchestration service:
 * 1. Find nearest warehouse for seller.
 * 2. Calculate shipping charge from that warehouse to customer.
 */
export async function calculateSellerToCustomerShipping({
  sellerId,
  customerId,
  productId,
  quantity,
  deliverySpeed = 'STANDARD',
}) {
  if (!sellerId || !customerId || !productId || !quantity || quantity <= 0) {
    const error = new Error('Invalid shipping request input');
    error.statusCode = 400;
    throw error;
  }

  const nearestWarehouse = await getNearestWarehouseForSeller(sellerId);

  const shipping = await calculateShippingCharge({
    warehouseId: nearestWarehouse.id,
    customerId,
    productId,
    quantity,
    deliverySpeed,
  });

  return {
    warehouse: {
      id: nearestWarehouse.id,
      latitude: nearestWarehouse.latitude,
      longitude: nearestWarehouse.longitude,
      distanceKmFromSeller: nearestWarehouse.distanceKm,
    },
    shipping,
  };
}

