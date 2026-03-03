import app from './app.js';
import config from './config/index.js';
import pool from './config/database.js';
import { ensureSchema } from './db/ensureSchema.js';

const { port } = config.app;

let server;

async function start() {
  try {
    await ensureSchema({ pool, database: config.db.database });
  } catch (err) {
    // Don't block server startup, but surface the real issue.
    console.error('Schema check failed:', err?.message || err);
  }

  server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\nReceived ${signal}. Shutting down...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await pool.end();
  console.log('Shutdown complete.');
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  shutdown('uncaughtException').catch(() => process.exit(1));
});
