import "@testing-library/jest-dom";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import {
  AuthProvider,
} from "../../context/AuthContext";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  getWeeklyReports,
} from "../../api/reportAPI";

import DashboardPage from "../DashboardPage";

vi.mock(
  "../../api/reportAPI",
  () => ({
    getWeeklyReports: vi.fn(),
  })
);

const mockedGetWeeklyReports =
  vi.mocked(getWeeklyReports);

function AuthenticatedDashboard() {
  const {
    login,
    user,
  } = useAuth();

  if (!user) {
    login({
      id: "user-123",
      username: "supervisor",
      email: "supervisor@example.com",
      role: "supervisor",
    });

    return null;
  }

  return <DashboardPage />;
}

function renderDashboard() {
  render(
    <AuthProvider>
      <AuthenticatedDashboard />
    </AuthProvider>
  );
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the latest weekly report", async () => {
    mockedGetWeeklyReports
      .mockResolvedValue([
        {
          _id: "report-1",
          department: "department-1",
          weekStart: "2026-08-02",
          weekEnd: "2026-08-08",
          status: "draft",

          metrics: {
            openedWorkOrders: 8,
            completedWorkOrders: 6,
            overdueWorkOrders: 1,
            openBacklog: 2,
            completionRate: 75,
            totalLaborHours: 40,
          },
        },
      ]);

    renderDashboard();

    expect(
      await screen.findByText(
        /latest weekly report/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /completion rate: 75%/i
      )
    ).toBeInTheDocument();
  });

  it("shows a message when there are no reports", async () => {
    mockedGetWeeklyReports
      .mockResolvedValue([]);

    renderDashboard();

    expect(
      await screen.findByText(
        /no weekly reports yet/i
      )
    ).toBeInTheDocument();
  });

  it("shows an error when reports cannot be loaded", async () => {
    mockedGetWeeklyReports
      .mockRejectedValue(
        new Error(
          "Unable to load reports"
        )
      );

    renderDashboard();

    expect(
      await screen.findByText(
        "Unable to load reports"
      )
    ).toBeInTheDocument();
  });
});