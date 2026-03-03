import { StandardDeliveryStrategy } from './StandardDeliveryStrategy.js';
import { ExpressDeliveryStrategy } from './ExpressDeliveryStrategy.js';

/**
 * Factory for delivery speed pricing strategies.
 * Extensible: add a new strategy and case here (e.g. SAME_DAY).
 */
export function getDeliveryPricingStrategy(speed = 'STANDARD') {
  const normalized = String(speed || '').toUpperCase();

  switch (normalized) {
    case 'EXPRESS':
      return new ExpressDeliveryStrategy();
    case 'STANDARD':
    default:
      return new StandardDeliveryStrategy();
  }
}

