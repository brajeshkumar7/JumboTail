import { Redis } from '@upstash/redis';
import config from './index.js';

const redis =
  config.redis.url && config.redis.token
    ? new Redis({
        url: config.redis.url,
        token: config.redis.token,
      })
    : null;

export default redis;
