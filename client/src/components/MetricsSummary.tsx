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

      <ul className="metrics-summary__items">
        <li className="metrics-summary__item">
          Opened: {metrics.openedWorkOrders}
        </li>

        <li className="metrics-summary__item">
          Completed: {metrics.completedWorkOrders}
        </li>

        <li className="metrics-summary__item">
          Overdue: {metrics.overdueWorkOrders}
        </li>

        <li className="metrics-summary__item">
          Backlog: {metrics.openBacklog}
        </li>

        <li className="metrics-summary__item">
          Completion Rate: {metrics.completionRate}%
        </li>

        <li className="metrics-summary__item">
          Labor Hours: {metrics.totalLaborHours}
        </li>
      </ul>
    </section>
  );
}