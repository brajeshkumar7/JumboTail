/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import { listSellers, createSeller } from '../services/sellerService.js';

export async function getSellers(req, res) {
  const sellers = await listSellers();
  return res.json(sellers);
}

export async function postSeller(req, res) {
  const seller = await createSeller(req.body);
  return res.status(201).json(seller);
}

