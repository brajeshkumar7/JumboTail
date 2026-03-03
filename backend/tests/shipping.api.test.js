import request from 'supertest';
import app from '../src/app.js';
import config from '../src/config/index.js';
import pool from '../src/config/database.js';

/**
 * Helper to insert a row and return its auto-increment id.
 */
async function insertAndGetId(sql, params) {
  const [result] = await pool.execute(sql, params);
  return result.insertId;
}

describe('Shipping APIs', () => {
  let sellerId;
  let customerId;
  let warehouseId;
  let productId;

  beforeAll(async () => {
    // Clean test data (best-effort, assumes foreign keys as defined in schema).
    await pool.execute('DELETE FROM order_items');
    await pool.execute('DELETE FROM orders');
    await pool.execute('DELETE FROM products');
    await pool.execute('DELETE FROM warehouses');
    await pool.execute('DELETE FROM customers');
    await pool.execute('DELETE FROM sellers');

    sellerId = await insertAndGetId(
      `
      INSERT INTO sellers (name, phone, latitude, longitude, created_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      ['Test Seller', '1234567890', 12.9716, 77.5946]
    );

    customerId = await insertAndGetId(
      `
      INSERT INTO customers (name, phone, latitude, longitude, created_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      ['Test Customer', '9876543210', 12.9750, 77.6000]
    );

    warehouseId = await insertAndGetId(
      `
      INSERT INTO warehouses (name, latitude, longitude, created_at)
      VALUES (?, ?, ?, NOW())
      `,
      ['Test Warehouse', 12.9800, 77.6100]
    );

    productId = await insertAndGetId(
      `
      INSERT INTO products
        (seller_id, sku, name, weight_grams, length_cm, width_cm, height_cm, created_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [sellerId, 'TEST-SKU', 'Test Product', 1000, 10, 10, 10]
    );
  });

  afterAll(async () => {
    await pool.end();
  });

  test('POST /api/v1/shipping-charge/calculate returns shipping for valid input', async () => {
    const res = await request(app)
      .post('/api/v1/shipping-charge/calculate')
      .send({
        sellerId,
        customerId,
        productId,
        quantity: 2,
        deliverySpeed: 'STANDARD',
      })
      .expect(200);

    expect(res.body).toHaveProperty('warehouse');
    expect(res.body).toHaveProperty('shipping');
    expect(res.body.shipping).toMatchObject({
      warehouseId: expect.any(Number),
      customerId,
      productId,
      quantity: 2,
      deliverySpeed: 'STANDARD',
      totalCharge: expect.any(Number),
    });
  });

  test('POST /api/v1/shipping-charge/calculate rejects missing sellerId', async () => {
    const res = await request(app)
      .post('/api/v1/shipping-charge/calculate')
      .send({
        customerId,
        productId,
        quantity: 1,
        deliverySpeed: 'STANDARD',
      })
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error.toLowerCase()).toContain('invalid sellerid');
  });

  test('POST /api/v1/shipping-charge/calculate rejects unsupported delivery speed', async () => {
    const res = await request(app)
      .post('/api/v1/shipping-charge/calculate')
      .send({
        sellerId,
        customerId,
        productId,
        quantity: 1,
        deliverySpeed: 'SUPER_FAST',
      })
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Unsupported deliverySpeed');
  });

  test('GET /api/v1/shipping-charge returns 404 when warehouse not found', async () => {
    // Use a non-existing warehouseId
    const res = await request(app)
      .get('/api/v1/shipping-charge')
      .query({
        warehouseId: 999999,
        customerId,
        productId,
        quantity: 1,
        deliverySpeed: 'STANDARD',
      })
      .expect(404);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Warehouse not found');
  });

  test('GET /api/v1/warehouse/nearest returns 404 when seller has no location', async () => {
    const sellerWithoutLocation = await insertAndGetId(
      `
      INSERT INTO sellers (name, phone, created_at)
      VALUES (?, ?, NOW())
      `,
      ['No Location Seller', '0000000000']
    );

    const res = await request(app)
      .get('/api/v1/warehouse/nearest')
      .query({ sellerId: sellerWithoutLocation })
      .expect(422);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Seller location is not set');
  });
});

