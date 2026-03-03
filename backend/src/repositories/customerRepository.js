import pool from '../config/database.js';
import { BaseRepository } from './baseRepository.js';

class CustomerRepository extends BaseRepository {
  constructor() {
    super(pool, 'customers');
  }

  async findLocationById(id) {
    const rows = await this.query(
      'SELECT id, latitude, longitude FROM customers WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  }
}

const customerRepository = new CustomerRepository();

export default customerRepository;