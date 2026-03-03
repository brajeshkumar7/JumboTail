import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class SellerRepository extends BaseRepository {
  constructor() {
    super(pool, 'sellers');
  }

  async findLocationById(id) {
    const rows = await this.query(
      'SELECT id, latitude, longitude FROM sellers WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  }
}

const sellerRepository = new SellerRepository();

export default sellerRepository;
