/**
 * Centralized cache key prefixes and TTLs for Redis (Upstash).
 */
export const cacheKeys = {
  item: 'item',
  user: 'user',
};

export const cacheTtl = {
  short: 60,       // 1 min
  medium: 300,     // 5 min
  long: 3600,      // 1 hour
};
