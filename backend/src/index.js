import app from './app.js';
import config from './config/index.js';
import pool from './config/database.js';

const { port } = config.app;

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\nReceived ${signal}. Shutting down...`);

  await new Promise((resolve) => server.close(resolve));
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
