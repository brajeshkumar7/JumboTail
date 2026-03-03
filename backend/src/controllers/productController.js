/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import { listProducts, createProduct } from '../services/productService.js';

export async function getProducts(req, res) {
  const products = await listProducts();
  return res.json(products);
}

export async function postProduct(req, res) {
  const product = await createProduct(req.body);
  return res.status(201).json(product);
}

