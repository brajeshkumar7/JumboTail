# B2B E‑Commerce Shipping Charge Estimator

A full‑stack reference implementation for calculating shipping charges in a B2B e‑commerce setting.  
It models a marketplace where sellers ship products to kirana stores (customers) via warehouses, with distance‑ and weight‑based pricing and delivery‑speed surcharges.

---

## Problem statement

In a B2B marketplace, shipping cost is a critical part of unit economics. Operators need a reliable way to:

- Determine the **nearest warehouse** for a seller.
- Estimate **transport cost** based on **distance** and **weight**.
- Apply **delivery‑speed pricing** (Standard vs Express).
- Expose these calculations via clean APIs and a simple UI for operations teams.

This project provides a production‑style implementation of that flow with clean layering, caching, and automated tests.

---

## Tech stack

- **Backend**
  - Node.js, Express
  - MySQL (mysql2, connection pool)
  - Redis (Upstash) for caching
  - Jest + Supertest for API tests
- **Frontend**
  - React (Vite)
  - Zustand for global state
  - Axios for HTTP client
  - React Router for routing

---

## Architecture overview

Project layout:

```text
JumboTail/
├── backend/
│   ├── src/
│   │   ├── config/          # App, DB, Redis, CORS, env loading
│   │   ├── controllers/     # HTTP only – delegate to services
│   │   ├── services/        # Business logic & orchestration
│   │   ├── repositories/    # Data access (MySQL)
│   │   ├── routes/          # Route definitions & versioning
│   │   ├── strategies/      # Shipping + delivery Strategy pattern
│   │   ├── middleware/      # Error handling, 404
│   │   ├── utils/           # Helpers (cache keys, async handler, geo, etc.)
│   │   ├── db/
│   │   │   ├── migrations/  # SQL DDLs
│   │   │   └── ensureSchema.js  # Runtime guards for dev
│   │   ├── app.js           # Express app wiring
│   │   └── index.js         # Server bootstrap & graceful shutdown
│   ├── tests/               # Jest + Supertest API tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Shipping calculator screen
│   │   ├── stores/          # Zustand store for shipping flow
│   │   ├── services/        # Axios API clients (shipping + master data)
│   │   ├── config/          # Frontend config (API base URL)
│   │   ├── utils/           # Legacy API helper
│   │   ├── App.jsx          # React Router wiring
│   │   └── main.jsx         # Vite entry point
│   └── package.json
├── .env.example
└── README.md
```

**Layering (backend)**  

- **Controllers** – validate HTTP input and delegate. No business logic.
- **Services** – implement business rules:
  - Nearest‑warehouse lookup.
  - Shipping cost calculation (transport + delivery speed).
  - Orchestration from seller → nearest warehouse → customer.
- **Repositories** – encapsulate all SQL; no domain rules.
- **Strategies** – encapsulate pricing rules for:
  - Transport mode (Mini Van, Truck, Aeroplane).
  - Delivery speed (Standard, Express).
- **Middleware** – centralized error handling, 404.

---

## Design patterns used

- **Clean architecture / layered architecture**
  - Controllers → Services → Repositories → DB.
  - Config and infrastructure isolated from business rules.

- **Strategy Pattern**
  - **Shipping strategies** (transport mode):
    - `MiniVanShippingStrategy` – 0–100 km, 3 Rs/km/kg.
    - `TruckShippingStrategy` – 100+ km, 2 Rs/km/kg.
    - `AirplaneShippingStrategy` – 500+ km, 1 Rs/km/kg.
    - Selected by `ShippingCostStrategyFactory` based on distance.
  - **Delivery pricing strategies**:
    - `StandardDeliveryStrategy` – base 10 Rs + shipping cost.
    - `ExpressDeliveryStrategy` – base 10 Rs + 1.2 Rs/kg extra + shipping cost.
    - Selected by `DeliveryPricingStrategyFactory`.

- **Repository Pattern**
  - `BaseRepository` centralizes `query`, `findById`, `findAll`.
  - Domain repositories (Seller, Customer, Warehouse, Product) build on top.

- **Orchestration / Application service**
  - `shippingOrchestrationService.calculateSellerToCustomerShipping` coordinates:
    1. Nearest warehouse for seller.
    2. Shipping charge between that warehouse and customer.
    3. Caching of combined result.

- **Cache‑aside pattern**
  - Services check Redis first, then rebuild on cache miss.

---

## API documentation (high level)

Base URL (backend): `http://localhost:3000/api`

### Master data APIs (v1)

All endpoints return JSON.

- **List sellers**
  - `GET /api/v1/sellers`
  - Response: `[{ id, name, phone, latitude, longitude }, ...]`

- **Create seller**
  - `POST /api/v1/sellers`
  - Body: `{ name: string, phone?: string, latitude?: number, longitude?: number }`
  - Validation:
    - `name` required.
    - `latitude` / `longitude` must be numbers if provided.

- **List customers**
  - `GET /api/v1/customers`

- **Create customer**
  - `POST /api/v1/customers`
  - Body: `{ name, phone, latitude, longitude }` (all required).

- **List warehouses**
  - `GET /api/v1/warehouses`

- **Create warehouse**
  - `POST /api/v1/warehouses`
  - Body: `{ name, latitude, longitude }` (all required).

- **List products**
  - `GET /api/v1/products`

- **Create product**
  - `POST /api/v1/products`
  - Body:
    ```json
    {
      "sellerId": number,
      "sku": "string",
      "name": "string",
      "weightGrams": number,
      "lengthCm": number,
      "widthCm": number,
      "heightCm": number
    }
    ```

### Nearest warehouse

- `GET /api/v1/warehouse/nearest?sellerId={id}&productId={optional}`

Response:

```json
{
  "sellerId": 1,
  "productId": 3,
  "warehouse": {
    "id": 2,
    "latitude": 12.98,
    "longitude": 77.61,
    "distanceKm": 3.52
  }
}
```

### Shipping charge (direct, warehouse → customer)

- `GET /api/v1/shipping-charge`
  - Query params:
    - `warehouseId` – required
    - `customerId` – required
    - `productId` – required
    - `quantity` – required, positive
    - `deliverySpeed` – optional; `STANDARD` or `EXPRESS`

Response:

```json
{
  "warehouseId": 2,
  "customerId": 4,
  "productId": 3,
  "quantity": 2,
  "distanceKm": 12.7,
  "transportMode": "TRUCK",
  "weightKg": 2,
  "baseShippingCost": 50,
  "deliverySpeed": "STANDARD",
  "totalCharge": 60
}
```

### Combined shipping (seller → nearest warehouse → customer)

- `POST /api/v1/shipping-charge/calculate`
  - Body:
    ```json
    {
      "sellerId": number,
      "customerId": number,
      "productId": number,
      "quantity": number,
      "deliverySpeed": "STANDARD" | "EXPRESS"
    }
    ```

Response:

```json
{
  "warehouse": {
    "id": 2,
    "latitude": 12.98,
    "longitude": 77.61,
    "distanceKmFromSeller": 3.52
  },
  "shipping": {
    "warehouseId": 2,
    "customerId": 4,
    "productId": 3,
    "quantity": 2,
    "distanceKm": 12.7,
    "transportMode": "TRUCK",
    "weightKg": 2,
    "baseShippingCost": 50,
    "deliverySpeed": "STANDARD",
    "totalCharge": 60
  }
}
```

---

## Caching strategy

Redis (Upstash) is used with a **cache‑aside** strategy:

- **Nearest warehouse**
  - Key: `nearest_warehouse:seller:{sellerId}`
  - TTL: `cacheTtl.medium` (5 minutes).
  - Flow:
    1. `warehouseService.getNearestWarehouseForSeller` checks Redis via `redis.get()`.
    2. On miss, fetches from DB, computes nearest, then stores via `redis.set(key, value, {ex: ttl})`.

- **Shipping charge**
  - Key: `shipping_charge:wh:{warehouseId}:cust:{customerId}:prod:{productId}:qty:{quantity}:speed:{deliverySpeed}`
  - TTL: 5 minutes.
  - Uses `redis.set()` with `{ex: cacheTtl.medium}` option for expiration.

- **Items cache**
  - Key: `item:{id}`
  - TTL: `cacheTtl.short` (1 minute).
  - Used by item service for quick lookups.

- **Combined (orchestrated) shipping**
  - Key: `shipping_combined:seller:{sellerId}:cust:{customerId}:prod:{productId}:qty:{quantity}:speed:{deliverySpeed}`
  - TTL: 5 minutes.
  - Coordinates nearest warehouse + shipping charge, then caches the complete result.

**Upstash Redis API**  
The project uses `@upstash/redis` client with the following methods:
- `redis.get(key)` – retrieves cached value
- `redis.set(key, value, {ex: ttlSeconds})` – stores value with expiration time
- `redis.del(key)` – removes key from cache

Example:
```javascript
await redis.set(cacheKey, JSON.stringify(data), {ex: 300}); // 5 minute TTL
```

**Resilience**  
Every Redis operation is wrapped in `try/catch`; failures are logged and **do not break the core flow**. The system falls back to DB + computation automatically, ensuring the API always responds even if Redis is unavailable.

---

## Error handling

- Centralized in `middleware/errorHandler.js`.
- Every service throws `Error` objects with `statusCode` where appropriate:
  - `400` – invalid input / missing parameters.
  - `404` – entity not found (seller, customer, warehouse, product).
  - `422` – entity exists but not in a_valid state (e.g. missing coordinates).
  - `500` – unhandled or unexpected errors.

Example responses:

- `400 Bad Request`

```json
{ "error": "Invalid sellerId. It must be a positive number." }
```

- `404 Not Found`

```json
{ "error": "Warehouse not found" }
```

- `422 Unprocessable Entity`

```json
{ "error": "Seller location is not set" }
```

In non‑production environments, the error handler also returns a `stack` field to aid debugging.

---

## Frontend form behavior

The shipping calculator page (`ShippingCalculatorPage.jsx`) provides the following features:

### Auto-selection on data load
When the application loads master data (sellers, customers, products, warehouses), the form automatically selects:
- **First seller** in the list
- **First customer** in the list
- **First product** in the list
- **Default quantity**: 1
- **Default delivery speed**: STANDARD

This ensures the form is always in a valid state and ready to calculate without additional user interaction.

### Form validation
Before submission, the form performs client-side validation:

**Required fields validation:**
- Seller ID must be a positive number
- Customer ID must be a positive number
- Product ID must be a positive number
- Quantity must be a positive number (minimum 1)

If any field fails validation, a user-friendly alert is displayed indicating which field needs attention.

**Server-side validation:**
The backend also validates all parameters independently, returning `400 Bad Request` with detailed error messages if validation fails. This provides defense-in-depth validation.

### Master data management
Users can add new sellers, customers, products, and warehouses via the "Add seller / product / customer / warehouse" button. Form inputs are parsed and validated before submission:
- Seller: Name is required; phone, latitude, and longitude are optional
- Customer: Name, phone, latitude, and longitude are all required
- Warehouse: Name, latitude, and longitude are all required
- Product: Seller must be selected; all other fields are required

---

## Setup instructions

### Prerequisites

- Node.js 18+  
- MySQL 8+  
- (Optional) Upstash Redis instance

### 1. Configure environment

From the project root:

```bash
cp .env.example .env
```

Edit `.env`:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (optional)

### 2. Create database and apply schema

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS jumbotail;"

# Core schema (customers, sellers, products, warehouses, orders)
cd d:\JumboTail
cmd /c "mysql -u root -p jumbotail < backend\src\db\migrations\002_b2b_shipping_schema.sql"
```

> If you previously ran the seller‑location migration, you may see a duplicate‑column error; that simply means the columns already exist and can be ignored.

### 3. Install dependencies

```bash
cd d:\JumboTail\backend
npm install

cd ..\frontend
npm install
```

### 4. Run the app

From project root:

```bash
npm run dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

The frontend proxies `/api` to the backend via Vite dev server configuration.

### 5. Run tests (shipping APIs)

```bash
cd d:\JumboTail\backend
npm test
```

This executes Jest + Supertest tests in `backend/tests/shipping.api.test.js`.

### 6. Clean up test data (optional)

A cleanup script is available to remove test data from the database:

```bash
cd d:\JumboTail\backend
node cleanup-test-data.js
```

This script removes:
- All test sellers (Test Seller, No Location Seller)
- All test customers (Test Customer)
- All test products that start with "Test"

Use this after initial setup if you've populated the database with test data and want to start fresh.

---

## Assumptions

- A single nearest warehouse per seller is sufficient for pricing.
- Shipping price depends only on:
  - Linear distance between warehouse and customer (Haversine).
  - Total shipment weight (product weight × quantity).
  - Transport mode and delivery speed.
- Taxes, discounts, and surcharges (e.g. COD, fuel surcharge) are out of scope.
- Authentication/authorization is not implemented; APIs are open for demo purposes.
- One product per order is enough to demonstrate the flow; schema supports multi‑item orders.

---

## Future improvements

- **Richer pricing models**
  - Add slab‑based pricing, volumetric weight, zone‑based surcharges, and tax calculations.
  - Support multiple currencies and marketplace commissions.

- **Operational tooling**
  - Admin UI to manage warehouses, serviceable regions, and pricing rules.
  - Audit logging for all changes to master data.

- **Routing & performance**
  - Use map/routing APIs for road distance and travel‑time estimations.
  - Add background jobs to pre‑compute nearest warehouses for heavy sellers.

- **Reliability & security**
  - Add proper authentication/authorization (e.g. JWT + roles).
  - Rate limiting and input sanitization for public APIs.
  - Structured logging and metrics (Prometheus/OpenTelemetry).

- **Testing & CI**
  - Expand Jest tests to cover master‑data APIs and negative cases.
  - Add a CI workflow to run tests on every push and migration verification in a disposable DB.

This codebase is intentionally structured to be easy to extend: new business rules should live in **services/strategies**, new persistence concerns in **repositories**, and new integrations behind clear interfaces. 
