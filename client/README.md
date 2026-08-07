# SummitOps Intelligence Frontend

This is the React frontend for SummitOps Intelligence.

## What It Does

The frontend provides:
- login flow
- protected navigation
- dashboard report viewing
- weekly report creation form

It integrates with the backend API at http://localhost:5000.

## Frontend Structure

```text
client/
  src/
    api/
      authApi.ts
      reportAPI.ts
      httpClient.ts
    components/
      ProtectedRoute.tsx
      MetricsSummary.tsx
    context/
      AuthContext.tsx
    hooks/
      useAuth.ts
    pages/
      LoginPage.tsx
      DashboardPage.tsx
      OpsWeeklyReportPage.tsx
    test/
      setup.ts
    index.scss
```

## Auth and Routing

- Auth state is stored in AuthContext.
- JWT token is persisted in localStorage.
- ProtectedRoute blocks unauthenticated access to protected pages.
- App routes are defined in src/App.tsx.

## API Usage

The frontend uses a shared API utility in src/api/httpClient.ts for:
- base URL handling
- JSON request/response behavior
- consistent error handling
- optional Bearer token injection

Feature APIs:
- src/api/authApi.ts
- src/api/reportAPI.ts

## Styling

Global styling is in src/index.scss.

Current styling approach:
- SCSS variables for base colors
- BEM-like class naming for page/component blocks
- semantic markup paired with accessible status and alert regions

## Scripts

From client:

```bash
npm run dev
npm run build
npm run test -- --run
npm run lint
npm run preview
```

From repository root equivalents:

```bash
npm run dev:client
npm run build --prefix client
npm run test --prefix client -- --run
npm run lint --prefix client
```

## Environment

Optional environment file:

```env
VITE_API_URL=http://localhost:5000
```

Note: current API modules use an in-code base URL constant. Migrating to VITE_API_URL is recommended if you need multi-environment deploys.

## Testing Notes

- Vitest is configured through vite.config.ts.
- Global test setup is in src/test/setup.ts.
- Testing Library matchers are loaded once in setup (not per test file).
