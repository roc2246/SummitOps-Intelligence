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
        aria-busy={loading}
      >
        <label htmlFor="departmentId">
          Department ID:
        </label>

        <input
          id="departmentId"
          name="departmentId"
          autoComplete="off"
          value={departmentId}
          onChange={(event) =>
            setDepartmentId(event.target.value)
          }
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "weekly-report-error"
              : undefined
          }
          required
        />

        <label htmlFor="weekStart">
          Week Start:
        </label>

        <input
          id="weekStart"
          name="weekStart"
          type="date"
          value={weekStart}
          onChange={(event) =>
            setWeekStart(event.target.value)
          }
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "weekly-report-error"
              : undefined
          }
          required
        />

        <label htmlFor="weekEnd">
          Week End:
        </label>

        <input
          id="weekEnd"
          name="weekEnd"
          type="date"
          value={weekEnd}
          onChange={(event) =>
            setWeekEnd(event.target.value)
          }
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "weekly-report-error"
              : undefined
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
        <p
          id="weekly-report-error"
          className="weekly-report-page__error"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}

      {report && (
        <section
          className="weekly-report-page__results"
          aria-live="polite"
        >
          <h2>
            Report Metrics
          </h2>

          <ul>
            <li>
              Opened:{" "}
              {report.metrics.openedWorkOrders}
            </li>

            <li>
              Completed:{" "}
              {report.metrics.completedWorkOrders}
            </li>

            <li>
              Overdue:{" "}
              {report.metrics.overdueWorkOrders}
            </li>

            <li>
              Backlog:{" "}
              {report.metrics.openBacklog}
            </li>

            <li>
              Completion Rate:{" "}
              {report.metrics.completionRate}%
            </li>

            <li>
              Labor Hours:{" "}
              {report.metrics.totalLaborHours}
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}