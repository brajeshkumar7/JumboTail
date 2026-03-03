import warehouseRepository from '../repositories/warehouseRepository.js';

export async function listWarehouses() {
  return warehouseRepository.findAll();
}

export async function createWarehouse(payload) {
  const name = payload?.name?.trim();
  const latitude = Number(payload?.latitude);
  const longitude = Number(payload?.longitude);

  if (!name) {
    const err = new Error('Warehouse name is required');
    err.statusCode = 400;
    throw err;
  }
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    const err = new Error('Warehouse latitude and longitude are required');
    err.statusCode = 400;
    throw err;
  }

  return warehouseRepository.create({ name, latitude, longitude });
}

