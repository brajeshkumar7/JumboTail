import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env if present; otherwise fall back to repo root .env
// __dirname = backend/src/config
const backendEnvPath = path.resolve(__dirname, '../../', '.env'); // backend/.env
const rootEnvPath = path.resolve(__dirname, '../../../', '.env'); // repo root .env

const envPath = fs.existsSync(backendEnvPath) ? backendEnvPath : rootEnvPath;
dotenv.config({ path: envPath });

export default {
  app: {
    port: Number(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'jumbotail',
  },
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
};
