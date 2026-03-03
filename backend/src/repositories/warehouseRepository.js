import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class WarehouseRepository extends BaseRepository {
  constructor() {
    super(pool, 'warehouses');
  }

  async findAllLocations() {
    return this.query(
      'SELECT id, latitude, longitude FROM warehouses',
      []
    );
  }
}

const warehouseRepository = new WarehouseRepository();

export default warehouseRepository;
