# SummitOps Intelligence

SummitOps Intelligence is a full-stack MERN operations reporting platform.

It provides a secure reporting workflow where authenticated users can:
- log in
- review weekly report metrics
- create weekly reports (manager/admin only)

## Current Status

This repository contains:
- a React + TypeScript + Vite frontend in client
- a Node.js + Express + TypeScript + MongoDB backend in server
- JWT-based authentication and role-based authorization
- automated frontend and backend tests

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- SCSS
- Vitest + Testing Library

### Backend
- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT auth

## Repository Structure

```text
SummitOps-Intelligence/
  client/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      index.scss
    package.json
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
      index.ts
    scripts/
    package.json
  MERN-prompts/
  package.json
```

## Architecture

### Backend request flow

```text
Route -> Middleware -> Controller -> Service -> Model -> MongoDB
```

### Security model
- Login issues JWT tokens.
- Protected endpoints require Authorization: Bearer <token>.
- Weekly report creation is restricted to manager/admin roles.
- Request payload validation runs before controller business logic.

## API Summary

Base URL (local): http://localhost:5000

### Health
- GET /api/health
- Response: { success, message, timestamp }

### Auth
- POST /api/auth/login
- Body:
  - email: string
  - password: string
- Success response:
  - success: true
  - token: string
  - user: { id, username, email, role }

### Reports
- GET /api/reports
- Auth required: yes (Bearer token)
- Query params:
  - page (default 1)
  - limit (default 20, max 100)
  - departmentId (optional)
  - weekStartFrom (optional ISO date-time)
  - weekStartTo (optional ISO date-time)
- Success response:
  - data: WeeklyReport[]
  - pagination: { page, limit, total, totalPages }

- POST /api/reports/weekly
- Auth required: yes (Bearer token)
- Role required: manager or admin
- Body:
  - departmentId: Mongo ObjectId string
  - weekStart: ISO 8601 UTC timestamp, for example 2026-08-02T00:00:00.000Z
  - weekEnd: ISO 8601 UTC timestamp, for example 2026-08-08T23:59:59.999Z
- Success response: created WeeklyReport

## Environment Variables

Create .env files in server and client.

### server/.env

Required:
- JWT_SECRET

Common:
- PORT (default 5000)
- MONGODB_URI (default mongodb://127.0.0.1:27017/mern_app)
- CLIENT_URL (default http://localhost:5173)
- JWT_EXPIRES_IN (default 1h)

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mern_app
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=1h
```

### client/.env

Optional:

```env
VITE_API_URL=http://localhost:5000
```

Note: the current frontend API layer uses a local base URL constant. VITE_API_URL is recommended for future environment-driven configuration.

## Installation

From repository root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## Development

Run both apps:

```bash
npm run dev
```

Run only client:

```bash
npm run dev:client
```

Run only server:

```bash
npm run dev:server
```

## Validation Commands

### Root

```bash
npm run build
```

### Server

```bash
npm run typecheck --prefix server
npm run test --prefix server
npm run build --prefix server
```

### Client

```bash
npm run test --prefix client -- --run
npm run lint --prefix client
npm run build --prefix client
```

## Known Constraints

- Root typecheck currently calls client typecheck, but client does not define a typecheck script.
- Use npm run build --prefix client for TypeScript compile verification in the client package.

## Additional Docs

- Frontend details: client/README.md
- Backend details: server/README.md
- Team standards and prompt toolkit: MERN-prompts/
