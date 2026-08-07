import {
  useEffect,
  useState,
} from "react";

import {
  getWeeklyReports,
} from "../api/reportAPI";

import type {
  WeeklyReport,
} from "../api/reportAPI";

import MetricsSummary from "../components/MetricsSummary";

import {
  useAuth,
} from "../hooks/useAuth";

export default function DashboardPage() {
  const {
    user,
    token,
  } = useAuth();

  const [reports, setReports] =
    useState<WeeklyReport[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const currentToken = token;

    async function loadReports() {
      try {
        const result =
          await getWeeklyReports(
            currentToken
          );

        setReports(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load reports"
        );
      } finally {
        setLoading(false);
      }
    }

    void loadReports();
  }, [token, user]);

  if (loading) {
    return (
      <p role="status" aria-live="polite">
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <p
        className="dashboard-page__error"
        role="alert"
        aria-live="assertive"
      >
        {error}
      </p>
    );
  }

  const latestReport =
    reports[0];

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">
        Dashboard
      </h1>

      {!latestReport && (
        <p>
          No weekly reports yet.
        </p>
      )}

      {latestReport && (
        <>
          <h2>
            Latest Weekly Report
          </h2>

          <MetricsSummary
            metrics={
              latestReport.metrics
            }
          />
        </>
      )}
    </div>
  );
}