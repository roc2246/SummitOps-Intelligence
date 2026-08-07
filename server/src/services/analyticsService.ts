import type {
  IWeeklyReportMetrics,
  IWorkOrderSnapshot,
} from "../models/index.js";

export function calculateWeeklyMetrics(
  workOrders: IWorkOrderSnapshot[],
  reportCutoff: Date,
): IWeeklyReportMetrics {
  const openedWorkOrders = workOrders.length;

  const completedWorkOrders = workOrders.filter(
    (workOrder) => workOrder.status === "completed",
  ).length;

  const openBacklog = workOrders.filter(
    (workOrder) =>
      workOrder.status !== "completed" && workOrder.status !== "cancelled",
  ).length;

  const overdueWorkOrders = workOrders.filter(
    (workOrder) =>
      workOrder.dueDateSource !== undefined &&
      workOrder.dueDateSource < reportCutoff &&
      workOrder.status !== "completed" &&
      workOrder.status !== "cancelled",
  ).length;

  const totalLaborHours = workOrders.reduce(
    (total, workOrder) => total + workOrder.laborHours,
    0,
  );

  const completionRate =
    openedWorkOrders === 0
      ? 0
      : Math.round((completedWorkOrders / openedWorkOrders) * 100);

  return {
    openedWorkOrders,
    completedWorkOrders,
    overdueWorkOrders,
    openBacklog,
    completionRate,
    totalLaborHours,
  };
}
