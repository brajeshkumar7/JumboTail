import sellerRepository from '../repositories/sellerRepository.js';
import warehouseRepository from '../repositories/warehouseRepository.js';
import { haversineDistanceKm } from '../utils/geo.js';

/**
 * Returns the nearest warehouse for the given seller ID.
 * Throws if seller or warehouse data is missing.
 */
export async function getNearestWarehouseForSeller(sellerId) {
  const sellerLocation = await sellerRepository.findLocationById(sellerId);
  if (!sellerLocation) {
    const error = new Error('Seller not found');
    error.statusCode = 404;
    throw error;
  }

  if (sellerLocation.latitude == null || sellerLocation.longitude == null) {
    const error = new Error('Seller location is not set');
    error.statusCode = 422;
    throw error;
  }

  const warehouses = await warehouseRepository.findAllLocations();
  if (!warehouses.length) {
    const error = new Error('No warehouses available');
    error.statusCode = 404;
    throw error;
  }

  const { latitude: sLat, longitude: sLon } = sellerLocation;

  let nearest = null;
  let minDistance = Infinity;

  for (const wh of warehouses) {
    if (wh.latitude == null || wh.longitude == null) continue;
    const distanceKm = haversineDistanceKm(
      Number(sLat),
      Number(sLon),
      Number(wh.latitude),
      Number(wh.longitude)
    );
    if (distanceKm < minDistance) {
      minDistance = distanceKm;
      nearest = { ...wh, distanceKm };
    }
  }

  if (!nearest) {
    const error = new Error('No warehouses with valid location');
    error.statusCode = 404;
    throw error;
  }

  return nearest;
}
