import { Navigate, NavLink, Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import OpsWeeklyReportPage from "./pages/OpsWeeklyReportPage";

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">SummitOps Intelligence</h1>

        <nav className="app__navigation">
          <NavLink to="/dashboard">Dashboard</NavLink>

          <NavLink to="/weekly-report">Weekly Report</NavLink>

          <NavLink to="/login">Login</NavLink>
        </nav>
      </header>

      <section className="app__content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/weekly-report" element={<OpsWeeklyReportPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </section>
    </main>
  );
}

export default App;
