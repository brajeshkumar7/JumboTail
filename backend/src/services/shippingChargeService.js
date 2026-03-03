import customerRepository from '../repositories/customerRepository.js';
import warehouseRepository from '../repositories/warehouseRepository.js';
import productRepository from '../repositories/productRepository.js';
import { haversineDistanceKm } from '../utils/geo.js';
import { calculateShippingCost } from './shippingCostService.js';
import { calculateDeliveryPrice } from './deliveryPricingService.js';
import redis from '../config/redis.js';
import { cacheKeys, cacheTtl } from '../utils/cacheKeys.js';

/**
 * High-level shipping charge calculation.
 * Keeps logic modular: repositories + geo util + transport strategy + delivery strategy.
 *
 * @param {Object} params
 * @param {number} params.warehouseId
 * @param {number} params.customerId
 * @param {number} params.productId
 * @param {number} params.quantity
 * @param {'STANDARD'|'EXPRESS'} params.deliverySpeed
 */
export async function calculateShippingCharge({
  warehouseId,
  customerId,
  productId,
  quantity,
  deliverySpeed = 'STANDARD',
}) {
  if (!warehouseId || !customerId || !productId || !quantity || quantity <= 0) {
    const error = new Error('Invalid shipping charge input');
    error.statusCode = 400;
    throw error;
  }

  const cacheKey = `${cacheKeys.shippingCharge}:wh:${warehouseId}:cust:${customerId}:prod:${productId}:qty:${quantity}:speed:${deliverySpeed}`;

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return typeof cached === 'string' ? JSON.parse(cached) : cached;
      }
    } catch (err) {
      console.error('Redis get error (shipping charge):', err);
    }
  }

  const [warehouse, customer, product] = await Promise.all([
    warehouseRepository.findLocationById(warehouseId),
    customerRepository.findLocationById(customerId),
    productRepository.findWeightById(productId),
  ]);

  if (!warehouse) {
    const error = new Error('Warehouse not found');
    error.statusCode = 404;
    throw error;
  }
  if (!customer) {
    const error = new Error('Customer not found');
    error.statusCode = 404;
    throw error;
  }
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const { latitude: wLat, longitude: wLon } = warehouse;
  const { latitude: cLat, longitude: cLon } = customer;

  if (
    wLat == null ||
    wLon == null ||
    cLat == null ||
    cLon == null
  ) {
    const error = new Error('Warehouse or customer location is not set');
    error.statusCode = 422;
    throw error;
  }

  const distanceKm = haversineDistanceKm(
    Number(wLat),
    Number(wLon),
    Number(cLat),
    Number(cLon)
  );

  // Convert grams to kilograms and apply quantity.
  const weightKgPerUnit = Number(product.weight_grams) / 1000;
  const totalWeightKg = weightKgPerUnit * quantity;

  const shippingCost = calculateShippingCost(distanceKm, totalWeightKg);
  const deliveryPricing = calculateDeliveryPrice(
    shippingCost.cost,
    totalWeightKg,
    deliverySpeed
  );

  const result = {
    warehouseId,
    customerId,
    productId,
    quantity,
    distanceKm: shippingCost.distanceKm,
    transportMode: shippingCost.mode,
    weightKg: shippingCost.weightKg,
    baseShippingCost: shippingCost.cost,
    deliverySpeed: deliveryPricing.speed,
    totalCharge: deliveryPricing.total,
  };

  if (redis) {
    try {
      await redis.set(
        cacheKey,
        JSON.stringify(result),
        {ex: cacheTtl.medium}
      );
    } catch (err) {
      console.error('Redis set error (shipping charge):', err);
    }
  }

  return result;
}
