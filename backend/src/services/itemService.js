/**
 * Business logic lives here. Controllers only delegate to services.
 */
import itemRepository from '../repositories/itemRepository.js';
import redis from '../config/redis.js';
import { cacheKeys, cacheTtl } from '../utils/cacheKeys.js';

const CACHE_PREFIX = cacheKeys.item;
const TTL = cacheTtl.short;

async function getById(id) {
  if (redis) {
    const cached = await redis.get(`${CACHE_PREFIX}:${id}`);
    if (cached) return JSON.parse(cached);
  }
  const item = await itemRepository.findById(id);
  if (redis && item) {
    await redis.set(`${CACHE_PREFIX}:${id}`, JSON.stringify(item), {ex: TTL});
  }
  return item;
}

async function getAll(limit = 100, offset = 0) {
  return itemRepository.findAll(limit, offset);
}

async function create(data) {
  const item = await itemRepository.create(data);
  return item;
}

async function update(id, data) {
  const item = await itemRepository.updateById(id, data);
  if (redis) await redis.del(`${CACHE_PREFIX}:${id}`);
  return item;
}

async function remove(id) {
  const deleted = await itemRepository.deleteById(id);
  if (redis) await redis.del(`${CACHE_PREFIX}:${id}`);
  return deleted;
}

export default {
  getById,
  getAll,
  create,
  update,
  remove,
};
