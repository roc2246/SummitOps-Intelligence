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
  message?: string;
}

interface ApiErrorResponse {
  message?: string;
}

export async function createWeeklyReport(
  input: CreateWeeklyReportInput,
  token: string
): Promise<WeeklyReport> {
  const response = await fetch(
    "http://localhost:5000/api/reports/weekly",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (data as ApiErrorResponse)
        .message ?? "Failed to create weekly report"
    );
  }

  return data as WeeklyReport;
}

export async function getWeeklyReports(
  token: string
): Promise<WeeklyReport[]> {
  const response = await fetch(
    "http://localhost:5000/api/reports",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data =
    (await response.json()) as
      | WeeklyReport[]
      | PaginatedWeeklyReportResponse;

  if (!response.ok) {
    const apiError = data as ApiErrorResponse;

    throw new Error(
      apiError.message ??
        "Failed to load weekly reports"
    );
  }

  if (Array.isArray(data)) {
    return data;
  }

  return data.data;
}