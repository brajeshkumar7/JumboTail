/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import itemService from '../services/itemService.js';

export async function getItem(req, res) {
  const item = await itemService.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
}

export async function getItems(req, res) {
  const limit = Math.min(Number(req.query.limit) || 100, 100);
  const offset = Number(req.query.offset) || 0;
  const items = await itemService.getAll(limit, offset);
  res.json(items);
}

export async function createItem(req, res) {
  const { name, description } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const item = await itemService.create({ name: name.trim(), description });
  res.status(201).json(item);
}

export async function updateItem(req, res) {
  const id = Number(req.params.id);
  const { name, description } = req.body;
  const item = await itemService.getById(id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const updated = await itemService.update(id, {
    name: name?.trim() ?? item.name,
    description: description !== undefined ? description : item.description,
  });
  res.json(updated);
}

export async function deleteItem(req, res) {
  const deleted = await itemService.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Item not found' });
  res.status(204).send();
}
