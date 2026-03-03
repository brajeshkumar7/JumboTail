/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import { calculateShippingCharge } from '../services/shippingChargeService.js';

export async function getShippingCharge(req, res) {
  const { warehouseId, customerId, productId, quantity, deliverySpeed } = req.query;

  const warehouseIdNum = Number(warehouseId);
  const customerIdNum = Number(customerId);
  const productIdNum = Number(productId);
  const quantityNum = Number(quantity);

  if (!warehouseId || Number.isNaN(warehouseIdNum) || warehouseIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid warehouseId. It must be a positive number.' });
  }

  if (!customerId || Number.isNaN(customerIdNum) || customerIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid customerId. It must be a positive number.' });
  }

  if (!productId || Number.isNaN(productIdNum) || productIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid productId. It must be a positive number.' });
  }

  if (!quantity || Number.isNaN(quantityNum) || quantityNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid quantity. It must be a positive number.' });
  }

  let speed = 'STANDARD';
  if (deliverySpeed) {
    const normalized = String(deliverySpeed).toUpperCase();
    if (normalized !== 'STANDARD' && normalized !== 'EXPRESS') {
      return res.status(400).json({
        error: 'Unsupported deliverySpeed. Allowed values: STANDARD, EXPRESS.',
      });
    }
    speed = normalized;
  }

  const result = await calculateShippingCharge({
    warehouseId: warehouseIdNum,
    customerId: customerIdNum,
    productId: productIdNum,
    quantity: quantityNum,
    deliverySpeed: speed,
  });

  return res.json({
    warehouseId: result.warehouseId,
    customerId: result.customerId,
    productId: result.productId,
    quantity: result.quantity,
    distanceKm: result.distanceKm,
    transportMode: result.transportMode,
    weightKg: result.weightKg,
    baseShippingCost: result.baseShippingCost,
    deliverySpeed: result.deliverySpeed,
    totalCharge: result.totalCharge,
  });
}
