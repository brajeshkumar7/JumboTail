/**
 * Controllers: HTTP only. No business logic – delegate to services.
 */
import itemService from '../services/itemService.js';

export async function getItem(req, res, next) {
  try {
    const item = await itemService.getById(Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function getItems(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 100);
    const offset = Number(req.query.offset) || 0;
    const items = await itemService.getAll(limit, offset);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const item = await itemService.create({ name: name.trim(), description });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    const item = await itemService.getById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const updated = await itemService.update(id, {
      name: name?.trim() ?? item.name,
      description: description !== undefined ? description : item.description,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const deleted = await itemService.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
