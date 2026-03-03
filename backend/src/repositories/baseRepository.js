/**
 * Base repository pattern – data access only, no business logic.
 * Extend for domain-specific repositories.
 */

export class BaseRepository {
  constructor(pool, tableName) {
    this.pool = pool;
    this.tableName = tableName;
  }

  async query(sql, params = []) {
    // Use `.query()` (not `.execute()`) so mysql2 can apply `??` identifier placeholders.
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  async findById(id) {
    const rows = await this.query(
      `SELECT * FROM ?? WHERE id = ? LIMIT 1`,
      [this.tableName, id]
    );
    return rows[0] ?? null;
  }

  async findAll(limit = 100, offset = 0) {
    return this.query(
      `SELECT * FROM ?? ORDER BY id DESC LIMIT ? OFFSET ?`,
      [this.tableName, limit, offset]
    );
  }
}
