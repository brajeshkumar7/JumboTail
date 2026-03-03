import mysql from 'mysql2/promise';
import config from './src/config/index.js';

/**
 * Cleanup script to remove test data from the database.
 * Run with: node cleanup-test-data.js
 */

async function cleanupTestData() {
  const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();

  try {
    console.log('Starting cleanup of test data...\n');

    // Delete test products first (due to foreign key constraints)
    console.log('Deleting test products...');
    const [productResult] = await conn.execute(
      "DELETE FROM products WHERE name LIKE 'Test%'"
    );
    console.log(`Deleted ${productResult.affectedRows} test product(s)\n`);

    // Delete test customers
    console.log('Deleting test customers...');
    const [customerResult] = await conn.execute(
      "DELETE FROM customers WHERE name LIKE 'Test%'"
    );
    console.log(`Deleted ${customerResult.affectedRows} test customer(s)\n`);

    // Delete test sellers (Test Seller and No Location Seller)
    console.log('Deleting test sellers...');
    const [sellerResult] = await conn.execute(
      "DELETE FROM sellers WHERE name LIKE 'Test%' OR name = 'No Location Seller'"
    );
    console.log(`Deleted ${sellerResult.affectedRows} test seller(s)\n`);

    console.log('✓ Cleanup complete! Test data has been removed.');
  } catch (err) {
    console.error('Error during cleanup:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
    await pool.end();
  }
}

cleanupTestData();
