import { useState } from "react";
import type { FormEvent } from "react";

import {
  createWeeklyReport,
} from "../api/reportAPI";

import type {
  WeeklyReport,
} from "../api/reportAPI";

import {
  useAuth,
} from "../hooks/useAuth";

export default function WeeklyReportPage() {
  const {
    token,
    user,
  } = useAuth();

  const [departmentId, setDepartmentId] =
    useState("");

  const [weekStart, setWeekStart] =
    useState("");

  const [weekEnd, setWeekEnd] =
    useState("");

  const [report, setReport] =
    useState<WeeklyReport | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user || !token) {
      setError("You must be logged in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result =
        await createWeeklyReport(
          {
            departmentId,
            weekStart,
            weekEnd,
          },
          token
        );

      setReport(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create report"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="weekly-report-page">
      <h1 className="weekly-report-page__title">
        Weekly Report
      </h1>

      <form
        className="weekly-report-page__form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="departmentId">
          Department ID:
        </label>

        <input
          id="departmentId"
          value={departmentId}
          onChange={(event) =>
            setDepartmentId(event.target.value)
          }
          required
        />

        <label htmlFor="weekStart">
          Week Start:
        </label>

        <input
          id="weekStart"
          type="date"
          value={weekStart}
          onChange={(event) =>
            setWeekStart(event.target.value)
          }
          required
        />

        <label htmlFor="weekEnd">
          Week End:
        </label>

        <input
          id="weekEnd"
          type="date"
          value={weekEnd}
          onChange={(event) =>
            setWeekEnd(event.target.value)
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate Report"}
        </button>
      </form>

      {error && (
        <p className="weekly-report-page__error">
          {error}
        </p>
      )}

      {report && (
        <section className="weekly-report-page__results">
          <h2>
            Report Metrics
          </h2>

          <p>
            Opened:{" "}
            {report.metrics.openedWorkOrders}
          </p>

          <p>
            Completed:{" "}
            {report.metrics.completedWorkOrders}
          </p>

          <p>
            Overdue:{" "}
            {report.metrics.overdueWorkOrders}
          </p>

          <p>
            Backlog:{" "}
            {report.metrics.openBacklog}
          </p>

          <p>
            Completion Rate:{" "}
            {report.metrics.completionRate}%
          </p>

          <p>
            Labor Hours:{" "}
            {report.metrics.totalLaborHours}
          </p>
        </section>
      )}
    </div>
  );
}