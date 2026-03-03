import { getNearestWarehouseForSeller } from './warehouseService.js';
import { calculateShippingCharge } from './shippingChargeService.js';
import redis from '../config/redis.js';
import { cacheKeys, cacheTtl } from '../utils/cacheKeys.js';

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

  const cacheKey = `${cacheKeys.combinedShipping}:seller:${sellerId}:cust:${customerId}:prod:${productId}:qty:${quantity}:speed:${deliverySpeed}`;

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return typeof cached === 'string' ? JSON.parse(cached) : cached;
      }
    } catch (err) {
      console.error('Redis get error (combined shipping):', err);
    }
  }

  const nearestWarehouse = await getNearestWarehouseForSeller(sellerId);

  const shipping = await calculateShippingCharge({
    warehouseId: nearestWarehouse.id,
    customerId,
    productId,
    quantity,
    deliverySpeed,
  });

  const result = {
    warehouse: {
      id: nearestWarehouse.id,
      latitude: nearestWarehouse.latitude,
      longitude: nearestWarehouse.longitude,
      distanceKmFromSeller: nearestWarehouse.distanceKm,
    },
    shipping,
  };

  if (redis) {
    try {
      await redis.setex(
        cacheKey,
        cacheTtl.medium,
        JSON.stringify(result)
      );
    } catch (err) {
      console.error('Redis set error (combined shipping):', err);
    }
  }

  return result;
}

