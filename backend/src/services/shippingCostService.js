import { getShippingCostStrategy } from '../strategies/shipping/ShippingCostStrategyFactory.js';

/**
 * Business logic for shipping cost calculation.
 * Controllers should call this service instead of using strategies directly.
 */
export function calculateShippingCost(distanceKm, weightKg) {
  const strategy = getShippingCostStrategy(distanceKm);
  const cost = strategy.calculateCost(distanceKm, weightKg);

  return {
    mode: strategy.mode,
    distanceKm,
    weightKg,
    cost,
  };
}

