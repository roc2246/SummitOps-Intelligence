import {
  getJson,
  postJson,
} from "./httpClient";

export interface WeeklyReportMetrics {
  openedWorkOrders: number;
  completedWorkOrders: number;
  overdueWorkOrders: number;
  openBacklog: number;
  completionRate: number;
  totalLaborHours: number;
}

export interface WeeklyReport {
  _id: string;
  department: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  metrics: WeeklyReportMetrics;
}

export interface CreateWeeklyReportInput {
  departmentId: string;
  weekStart: string;
  weekEnd: string;
}

interface PaginatedWeeklyReportResponse {
  data: WeeklyReport[];
}

export async function createWeeklyReport(
  input: CreateWeeklyReportInput,
  token: string
): Promise<WeeklyReport> {
  return postJson<WeeklyReport, CreateWeeklyReportInput>(
    "/api/reports/weekly",
    input,
    {
      token,
      fallbackErrorMessage: "Failed to create weekly report",
    }
  );
}

export async function getWeeklyReports(
  token: string
): Promise<WeeklyReport[]> {
  const data = await getJson<
    WeeklyReport[] | PaginatedWeeklyReportResponse
  >(
    "/api/reports",
    {
      token,
      fallbackErrorMessage: "Failed to load weekly reports",
    }
  );

  if (Array.isArray(data)) {
    return data;
  }

  return data.data;
}