/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import { getNearestWarehouseForSeller } from '../services/warehouseService.js';

export async function getNearestWarehouse(req, res) {
  const { sellerId, productId } = req.query;

  const sellerIdNum = Number(sellerId);
  if (!sellerId || Number.isNaN(sellerIdNum) || sellerIdNum <= 0) {
    return res
      .status(400)
      .json({ error: 'Invalid sellerId. It must be a positive number.' });
  }

  let productIdNum = null;
  if (productId !== undefined) {
    productIdNum = Number(productId);
    if (Number.isNaN(productIdNum) || productIdNum <= 0) {
      return res
        .status(400)
        .json({ error: 'Invalid productId. It must be a positive number.' });
    }
  }

  const nearestWarehouse = await getNearestWarehouseForSeller(sellerIdNum);

  // Clean JSON response: basic metadata + nearest warehouse + distance.
  return res.json({
    sellerId: sellerIdNum,
    productId: productIdNum,
    warehouse: {
      id: nearestWarehouse.id,
      latitude: nearestWarehouse.latitude,
      longitude: nearestWarehouse.longitude,
      distanceKm: nearestWarehouse.distanceKm,
    },
  });
}