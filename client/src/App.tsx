import {
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import LogoutButton from "./components/auth/LogoutButton";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import WeeklyReportPage from "./pages/OpsWeeklyReportPage";

import {
  useAuth,
} from "./hooks/useAuth";

function App() {
  const {
    user,
  } = useAuth();

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">
          SummitOps Intelligence
        </h1>

        <nav className="app__navigation">
          {user && (
            <>
              <NavLink to="/dashboard">
                Dashboard
              </NavLink>

              <NavLink to="/weekly-report">
                Weekly Report
              </NavLink>

              <LogoutButton />
            </>
          )}

          {!user && (
            <NavLink to="/login">
              Login
            </NavLink>
          )}
        </nav>
      </header>

      <section className="app__content">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={
                  user
                    ? "/dashboard"
                    : "/login"
                }
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/weekly-report"
            element={
              <ProtectedRoute>
                <WeeklyReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to={
                  user
                    ? "/dashboard"
                    : "/login"
                }
                replace
              />
            }
          />
        </Routes>
      </section>
    </main>
  );
}

export default App;