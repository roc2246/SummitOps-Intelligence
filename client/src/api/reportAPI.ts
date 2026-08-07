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

export async function createWeeklyReport(
  input: CreateWeeklyReportInput,
  userId: string
): Promise<WeeklyReport> {
  const response = await fetch(
    "http://localhost:5000/api/reports/weekly",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify(input),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Failed to create weekly report"
    );
  }

  return data as WeeklyReport;
}

export async function getWeeklyReports(
  userId: string
): Promise<WeeklyReport[]> {
  const response = await fetch(
    "http://localhost:5000/api/reports",
    {
      headers: {
        "x-user-id": userId,
      },
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Failed to load weekly reports"
    );
  }

  return data as WeeklyReport[];
}