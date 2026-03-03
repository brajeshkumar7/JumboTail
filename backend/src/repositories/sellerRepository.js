import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class SellerRepository extends BaseRepository {
  constructor() {
    super(pool, 'sellers');
  }

  async findAll() {
    return this.query(
      'SELECT id, name, phone, latitude, longitude FROM sellers ORDER BY id DESC',
      []
    );
  }

  async findLocationById(id) {
    const rows = await this.query(
      'SELECT id, latitude, longitude FROM sellers WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  }

  async create({ name, phone = null, latitude = null, longitude = null }) {
    const [result] = await this.pool.execute(
      'INSERT INTO sellers (name, phone, latitude, longitude, created_at) VALUES (?, ?, ?, ?, NOW())',
      [name, phone, latitude, longitude]
    );
    const rows = await this.query(
      'SELECT id, name, phone, latitude, longitude FROM sellers WHERE id = ? LIMIT 1',
      [result.insertId]
    );
    return rows[0] ?? null;
  }
}

const sellerRepository = new SellerRepository();

export default sellerRepository;
