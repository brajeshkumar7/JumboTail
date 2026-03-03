import sellerRepository from '../repositories/sellerRepository.js';

export async function listSellers() {
  return sellerRepository.findAll();
}

export async function createSeller(payload) {
  const name = payload?.name?.trim();
  if (!name) {
    const err = new Error('Seller name is required');
    err.statusCode = 400;
    throw err;
  }

  const phone = payload?.phone ? String(payload.phone).trim() : null;
  const latitude =
    payload?.latitude === undefined || payload?.latitude === null
      ? null
      : Number(payload.latitude);
  const longitude =
    payload?.longitude === undefined || payload?.longitude === null
      ? null
      : Number(payload.longitude);

  if (latitude !== null && Number.isNaN(latitude)) {
    const err = new Error('Invalid latitude');
    err.statusCode = 400;
    throw err;
  }
  if (longitude !== null && Number.isNaN(longitude)) {
    const err = new Error('Invalid longitude');
    err.statusCode = 400;
    throw err;
  }

  return sellerRepository.create({ name, phone, latitude, longitude });
}

