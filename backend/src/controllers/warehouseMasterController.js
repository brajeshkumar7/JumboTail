/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import { listWarehouses, createWarehouse } from '../services/warehouseMasterService.js';

export async function getWarehouses(req, res) {
  const warehouses = await listWarehouses();
  return res.json(warehouses);
}

export async function postWarehouse(req, res) {
  const warehouse = await createWarehouse(req.body);
  return res.status(201).json(warehouse);
}

