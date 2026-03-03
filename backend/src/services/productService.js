import productRepository from '../repositories/productRepository.js';
import sellerRepository from '../repositories/sellerRepository.js';

export async function listProducts() {
  return productRepository.findAll();
}

export async function createProduct(payload) {
  const sellerId = Number(payload?.sellerId);
  const sku = payload?.sku ? String(payload.sku).trim() : '';
  const name = payload?.name?.trim();
  const weightGrams = Number(payload?.weightGrams ?? payload?.weight_grams);
  const lengthCm = Number(payload?.lengthCm ?? payload?.length_cm);
  const widthCm = Number(payload?.widthCm ?? payload?.width_cm);
  const heightCm = Number(payload?.heightCm ?? payload?.height_cm);

  if (Number.isNaN(sellerId) || sellerId <= 0) {
    const err = new Error('Valid sellerId is required');
    err.statusCode = 400;
    throw err;
  }
  if (!sku) {
    const err = new Error('Product sku is required');
    err.statusCode = 400;
    throw err;
  }
  if (!name) {
    const err = new Error('Product name is required');
    err.statusCode = 400;
    throw err;
  }
  if (Number.isNaN(weightGrams) || weightGrams <= 0) {
    const err = new Error('Product weightGrams is required');
    err.statusCode = 400;
    throw err;
  }
  if (
    Number.isNaN(lengthCm) ||
    Number.isNaN(widthCm) ||
    Number.isNaN(heightCm) ||
    lengthCm <= 0 ||
    widthCm <= 0 ||
    heightCm <= 0
  ) {
    const err = new Error('Product dimensions (lengthCm/widthCm/heightCm) are required');
    err.statusCode = 400;
    throw err;
  }

  // Ensure seller exists (helps debugging)
  const seller = await sellerRepository.findById(sellerId);
  if (!seller) {
    const err = new Error('Seller not found');
    err.statusCode = 404;
    throw err;
  }

  return productRepository.create({
    sellerId,
    sku,
    name,
    weightGrams,
    lengthCm,
    widthCm,
    heightCm,
  });
}

