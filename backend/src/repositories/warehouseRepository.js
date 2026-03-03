import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class WarehouseRepository extends BaseRepository {
  constructor() {
    super(pool, 'warehouses');
  }

  async findAll() {
    return this.query(
      'SELECT id, name, latitude, longitude FROM warehouses ORDER BY id DESC',
      []
    );
  }

  async findLocationById(id) {
    const rows = await this.query(
      'SELECT id, latitude, longitude FROM warehouses WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  }

  async findAllLocations() {
    return this.query(
      'SELECT id, latitude, longitude FROM warehouses',
      []
    );
  }

  async create({ name, latitude, longitude }) {
    const [result] = await this.pool.execute(
      'INSERT INTO warehouses (name, latitude, longitude, created_at) VALUES (?, ?, ?, NOW())',
      [name, latitude, longitude]
    );
    const rows = await this.query(
      'SELECT id, name, latitude, longitude FROM warehouses WHERE id = ? LIMIT 1',
      [result.insertId]
    );
    return rows[0] ?? null;
  }
}

const warehouseRepository = new WarehouseRepository();

export default warehouseRepository;
