/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import { listCustomers, createCustomer } from '../services/customerService.js';

export async function getCustomers(req, res) {
  const customers = await listCustomers();
  return res.json(customers);
}

export async function postCustomer(req, res) {
  const customer = await createCustomer(req.body);
  return res.status(201).json(customer);
}

