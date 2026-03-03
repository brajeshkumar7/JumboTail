-- Add seller coordinates for nearest-warehouse calculation
-- Run this if your `sellers` table was created without latitude/longitude.

ALTER TABLE sellers
  ADD COLUMN latitude DECIMAL(9,6) NULL,
  ADD COLUMN longitude DECIMAL(9,6) NULL;

CREATE INDEX idx_sellers_location ON sellers (latitude, longitude);

