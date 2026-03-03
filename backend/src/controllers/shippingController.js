/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import { calculateShippingCharge } from '../services/shippingChargeService.js';
import { calculateSellerToCustomerShipping } from '../services/shippingOrchestrationService.js';

export async function getShippingCharge(req, res) {
  const { warehouseId, customerId, productId, quantity, deliverySpeed } = req.query;

  // Validate warehouseId
  if (warehouseId === null || warehouseId === undefined || warehouseId === '') {
    return res
      .status(400)
      .json({ error: 'warehouseId is required' });
  }
  const warehouseIdNum = Number(warehouseId);
  if (Number.isNaN(warehouseIdNum) || warehouseIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid warehouseId. It must be a positive number.' });
  }

  // Validate customerId
  if (customerId === null || customerId === undefined || customerId === '') {
    return res
      .status(400)
      .json({ error: 'customerId is required' });
  }
  const customerIdNum = Number(customerId);
  if (Number.isNaN(customerIdNum) || customerIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid customerId. It must be a positive number.' });
  }

  // Validate productId
  if (productId === null || productId === undefined || productId === '') {
    return res
      .status(400)
      .json({ error: 'productId is required' });
  }
  const productIdNum = Number(productId);
  if (Number.isNaN(productIdNum) || productIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid productId. It must be a positive number.' });
  }

  // Validate quantity
  if (quantity === null || quantity === undefined || quantity === '') {
    return res
      .status(400)
      .json({ error: 'quantity is required' });
  }
  const quantityNum = Number(quantity);
  if (Number.isNaN(quantityNum) || quantityNum <= 0) {
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

export async function calculateShippingForSeller(req, res) {
  const { sellerId, customerId, productId, quantity, deliverySpeed } = req.body || {};

  // Validate sellerId
  if (sellerId === null || sellerId === undefined || sellerId === '') {
    return res
      .status(400)
      .json({ error: 'sellerId is required' });
  }
  const sellerIdNum = Number(sellerId);
  if (Number.isNaN(sellerIdNum) || sellerIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid sellerId. It must be a positive number.' });
  }

  // Validate customerId
  if (customerId === null || customerId === undefined || customerId === '') {
    return res
      .status(400)
      .json({ error: 'customerId is required' });
  }
  const customerIdNum = Number(customerId);
  if (Number.isNaN(customerIdNum) || customerIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid customerId. It must be a positive number.' });
  }

  // Validate productId
  if (productId === null || productId === undefined || productId === '') {
    return res
      .status(400)
      .json({ error: 'productId is required' });
  }
  const productIdNum = Number(productId);
  if (Number.isNaN(productIdNum) || productIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid productId. It must be a positive number.' });
  }

  // Validate quantity
  if (quantity === null || quantity === undefined || quantity === '') {
    return res
      .status(400)
      .json({ error: 'quantity is required' });
  }
  const quantityNum = Number(quantity);
  if (Number.isNaN(quantityNum) || quantityNum <= 0) {
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

  const result = await calculateSellerToCustomerShipping({
    sellerId: sellerIdNum,
    customerId: customerIdNum,
    productId: productIdNum,
    quantity: quantityNum,
    deliverySpeed: speed,
  });

  return res.json({
    warehouse: result.warehouse,
    shipping: result.shipping,
  });
}

