import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import WeeklyReportPage from "./pages/WeeklyReportPage";

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>SummitOps Intelligence</h1>
        <nav className="app__nav" aria-label="Primary navigation">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/weekly-report">Weekly Report</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </header>

      <section className="app__content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/weekly-report" element={<WeeklyReportPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </section>
    </main>
  );
}

export default App;
