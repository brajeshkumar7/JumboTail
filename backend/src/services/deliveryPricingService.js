import { getDeliveryPricingStrategy } from '../strategies/delivery/DeliveryPricingStrategyFactory.js';

/**
 * Combines base shipping transport cost with delivery speed pricing.
 *
 * @param {number} shippingCost - cost from the transport mode (e.g. MiniVan/Truck/Airplane)
 * @param {number} weightKg - package weight in kilograms
 * @param {'STANDARD'|'EXPRESS'} speed - delivery speed
 */
export function calculateDeliveryPrice(shippingCost, weightKg, speed = 'STANDARD') {
  const strategy = getDeliveryPricingStrategy(speed);
  const total = strategy.calculateTotal(shippingCost, weightKg);

  return {
    speed: strategy.speed,
    weightKg,
    shippingCost,
    total,
  };
}

