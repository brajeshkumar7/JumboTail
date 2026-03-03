import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class ProductRepository extends BaseRepository {
  constructor() {
    super(pool, 'products');
  }

  async findAll() {
    return this.query(
      `
      SELECT
        p.id,
        p.seller_id AS sellerId,
        p.sku,
        p.name,
        p.weight_grams AS weightGrams,
        p.length_cm AS lengthCm,
        p.width_cm AS widthCm,
        p.height_cm AS heightCm
      FROM products p
      ORDER BY p.id DESC
      `,
      []
    );
  }

  async findWeightById(id) {
    const rows = await this.query(
      'SELECT id, weight_grams FROM products WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  }

  async create({
    sellerId,
    sku,
    name,
    weightGrams,
    lengthCm,
    widthCm,
    heightCm,
  }) {
    const [result] = await this.pool.execute(
      `
      INSERT INTO products
        (seller_id, sku, name, weight_grams, length_cm, width_cm, height_cm, created_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [sellerId, sku, name, weightGrams, lengthCm, widthCm, heightCm]
    );
    const rows = await this.query(
      `
      SELECT
        id,
        seller_id AS sellerId,
        sku,
        name,
        weight_grams AS weightGrams,
        length_cm AS lengthCm,
        width_cm AS widthCm,
        height_cm AS heightCm
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [result.insertId]
    );
    return rows[0] ?? null;
  }
}

const productRepository = new ProductRepository();

export default productRepository;