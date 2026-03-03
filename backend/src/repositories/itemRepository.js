import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class ItemRepository extends BaseRepository {
  constructor() {
    super(pool, 'items');
  }

  async create(data) {
    const [result] = await this.pool.execute(
      'INSERT INTO items (name, description, created_at) VALUES (?, ?, NOW())',
      [data.name, data.description ?? null]
    );
    return this.findById(result.insertId);
  }

  async updateById(id, data) {
    await this.pool.execute(
      'UPDATE items SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [data.name, data.description ?? null, id]
    );
    return this.findById(id);
  }

  async deleteById(id) {
    const [result] = await this.pool.execute('DELETE FROM items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default new ItemRepository();
