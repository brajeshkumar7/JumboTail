import { StandardDeliveryStrategy } from './StandardDeliveryStrategy.js';
import { ExpressDeliveryStrategy } from './ExpressDeliveryStrategy.js';

/**
 * Factory for delivery speed pricing strategies.
 * Extensible: add a new strategy and case here (e.g. SAME_DAY).
 */
export function getDeliveryPricingStrategy(speed = 'STANDARD') {
  const normalized = String(speed || '').toUpperCase();

  if (!normalized) {
    const err = new Error('deliverySpeed is required');
    err.statusCode = 400;
    throw err;
  }

  switch (normalized) {
    case 'EXPRESS':
      return new ExpressDeliveryStrategy();
    case 'STANDARD':
      return new StandardDeliveryStrategy();
    default: {
      const err = new Error('Unsupported deliverySpeed. Allowed values: STANDARD, EXPRESS.');
      err.statusCode = 400;
      throw err;
    }
  }
}

