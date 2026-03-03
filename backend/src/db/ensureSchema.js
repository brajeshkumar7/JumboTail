/**
 * Minimal runtime schema guard for local/dev.
 * Ensures required columns exist so the API doesn't crash with "Unknown column".
 */

export async function ensureSchema({ pool, database }) {
  await ensureSellerLocationColumns({ pool, database });
}

async function ensureSellerLocationColumns({ pool, database }) {
  const [rows] = await pool.execute(
    `
    SELECT COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'sellers'
      AND COLUMN_NAME IN ('latitude', 'longitude')
    `,
    [database]
  );

  const existing = new Set(rows.map((r) => r.COLUMN_NAME));
  const missingLat = !existing.has('latitude');
  const missingLon = !existing.has('longitude');

  if (missingLat || missingLon) {
    const parts = [];
    if (missingLat) parts.push("ADD COLUMN latitude DECIMAL(9,6) NULL");
    if (missingLon) parts.push("ADD COLUMN longitude DECIMAL(9,6) NULL");
    await pool.execute(`ALTER TABLE sellers ${parts.join(', ')}`);
  }

  // Ensure index exists (safe to skip if already there).
  const [idxRows] = await pool.execute(
    `SHOW INDEX FROM sellers WHERE Key_name = 'idx_sellers_location'`
  );
  if (!idxRows.length) {
    await pool.execute(
      `CREATE INDEX idx_sellers_location ON sellers (latitude, longitude)`
    );
  }
}

