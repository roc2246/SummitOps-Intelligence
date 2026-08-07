import type {
  WeeklyReportMetrics,
} from "../api/reportAPI";

interface MetricsSummaryProps {
  metrics: WeeklyReportMetrics;
}

export default function MetricsSummary({
  metrics,
}: MetricsSummaryProps) {
  return (
    <section className="metrics-summary">
      <h2 className="metrics-summary__title">
        Report Metrics
      </h2>

      <div className="metrics-summary__items">
        <p className="metrics-summary__item">
          Opened: {metrics.openedWorkOrders}
        </p>

        <p className="metrics-summary__item">
          Completed: {metrics.completedWorkOrders}
        </p>

        <p className="metrics-summary__item">
          Overdue: {metrics.overdueWorkOrders}
        </p>

        <p className="metrics-summary__item">
          Backlog: {metrics.openBacklog}
        </p>

        <p className="metrics-summary__item">
          Completion Rate: {metrics.completionRate}%
        </p>

        <p className="metrics-summary__item">
          Labor Hours: {metrics.totalLaborHours}
        </p>
      </div>
    </section>
  );
}