# JumboTail

Full-stack JS application with clean architecture.

## Stack

- **Backend:** Node.js, Express
- **Frontend:** React, Vite
- **Database:** MySQL
- **Caching:** Redis (Upstash)
- **State:** Zustand

## Project structure

```
JumboTail/
├── backend/
│   └── src/
│       ├── config/          # App, DB, Redis, CORS config
│       ├── controllers/     # HTTP only – delegate to services
│       ├── services/        # Business logic
│       ├── repositories/    # Data access (MySQL)
│       ├── routes/          # Route definitions
│       ├── middleware/      # Error handling, auth, etc.
│       ├── utils/           # Helpers (cache keys, async handler)
│       ├── db/migrations/   # SQL migrations
│       ├── app.js
│       └── index.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── stores/          # Zustand
│       ├── config/
│       ├── utils/           # API client, etc.
│       └── hooks/
├── package.json             # Workspace root
├── .env.example
└── README.md
```

## Principles

- **Controllers:** Handle HTTP (req/res). No business logic; call services.
- **Services:** All business logic and orchestration (e.g. cache + DB).
- **Repositories:** Data access only (queries, inserts, updates).
- **Config:** Centralized in `config/`. No env reads in controllers/services.

## Setup

1. Copy `.env.example` to `.env` and set MySQL (and optional Upstash Redis).
2. Create DB and run migration:
   ```bash
   mysql -u root -p jumbotail < backend/src/db/migrations/001_create_items.sql
   ```
3. Install and run:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   npm run dev
   ```
   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173 (proxies `/api` to backend)

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Backend + frontend (concurrent) |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |
| `npm run build` | Build both |
| `npm run start` | Run built backend |

## Adding a new domain

1. **Backend:** Add repository → service → controller → route (and mount in `routes/index.js`).
2. **Frontend:** Add API usage in `utils/api.js` (or a dedicated client), Zustand store in `stores/`, then components/pages.
