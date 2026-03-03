import { MiniVanShippingStrategy } from './MiniVanShippingStrategy.js';
import { TruckShippingStrategy } from './TruckShippingStrategy.js';
import { AirplaneShippingStrategy } from './AirplaneShippingStrategy.js';

/**
 * Selects the appropriate shipping strategy based on distance.
 *
 * - 0–100 km      -> Mini Van
 * - >100–500 km   -> Truck
 * - >500 km       -> Aeroplane
 */
export function getShippingCostStrategy(distanceKm) {
  if (distanceKm < 0) {
    throw new Error('Distance must be non-negative');
  }

  if (distanceKm > 500) {
    return new AirplaneShippingStrategy();
  }

  if (distanceKm > 100) {
    return new TruckShippingStrategy();
  }

  return new MiniVanShippingStrategy();
}

