import customerRepository from '../repositories/customerRepository.js';

export async function listCustomers() {
  return customerRepository.findAll();
}

export async function createCustomer(payload) {
  const name = payload?.name?.trim();
  const phone = payload?.phone ? String(payload.phone).trim() : '';
  const latitude = Number(payload?.latitude);
  const longitude = Number(payload?.longitude);

  if (!name) {
    const err = new Error('Customer name is required');
    err.statusCode = 400;
    throw err;
  }
  if (!phone) {
    const err = new Error('Customer phone is required');
    err.statusCode = 400;
    throw err;
  }
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    const err = new Error('Customer latitude and longitude are required');
    err.statusCode = 400;
    throw err;
  }

  return customerRepository.create({ name, phone, latitude, longitude });
}

