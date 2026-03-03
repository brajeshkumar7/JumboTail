import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class ProductRepository extends BaseRepository {
  constructor() {
    super(pool, 'products');
  }

  async findWeightById(id) {
    const rows = await this.query(
      'SELECT id, weight_grams FROM products WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  }
}

const productRepository = new ProductRepository();

export default productRepository;