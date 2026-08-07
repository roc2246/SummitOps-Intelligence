# SummitOps Intelligence Backend

This is the Node.js/Express backend for SummitOps Intelligence.

## Responsibilities

The backend handles:
- authentication and JWT issuance
- authorization checks
- request validation
- weekly report generation
- report listing with pagination and filters

## Structure

```text
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
```

Request lifecycle:

```text
Route -> Middleware -> Controller -> Service -> Model -> MongoDB
```

## Environment

Required:
- JWT_SECRET

Common:
- PORT (default 5000)
- MONGODB_URI (default mongodb://127.0.0.1:27017/mern_app)
- CLIENT_URL (default http://localhost:5173)
- JWT_EXPIRES_IN (default 1h)

Example server/.env:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mern_app
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=1h
```

## Scripts

From server:

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run test
npm run seed
```

From repository root equivalents:

```bash
npm run dev:server
npm run build --prefix server
npm run typecheck --prefix server
npm run test --prefix server
```

## API Endpoints

Base URL: http://localhost:5000

### GET /api/health
Returns service status.

### POST /api/auth/login
Body:
- email: string
- password: string

Success response:
- success: true
- token: string
- user: { id, username, email, role }

Failure response:
- success: false
- message

### GET /api/reports
Auth required: Bearer token

Query params:
- page (default 1)
- limit (default 20, max 100)
- departmentId (optional ObjectId)
- weekStartFrom (optional ISO date-time)
- weekStartTo (optional ISO date-time)

Success response:
- data: WeeklyReport[]
- pagination: { page, limit, total, totalPages }

### POST /api/reports/weekly
Auth required: Bearer token
Role required: manager or admin

Body:
- departmentId: ObjectId string
- weekStart: ISO 8601 UTC timestamp
- weekEnd: ISO 8601 UTC timestamp

Validation rules:
- departmentId must be valid Mongo ObjectId
- weekStart/weekEnd must match strict ISO UTC timestamp format
- weekStart must be before or equal to weekEnd

## Middleware Notes

- requireAuth verifies Authorization: Bearer token and adds authUserId/authUserRole to request.
- requireRole enforces allowed roles after authentication.
- validateWeeklyReport enforces input schema before controller execution.
- notFoundHandler and errorHandler provide centralized error responses.
