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

import userEvent from "@testing-library/user-event";

import {
  AuthProvider,
} from "../../context/AuthContext";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  createWeeklyReport,
} from "../../api/reportAPI";

import WeeklyReportPage from "../OpsWeeklyReportPage";

vi.mock(
  "../../api/reportAPI",
  () => ({
    createWeeklyReport: vi.fn(),
  })
);

const mockedCreateWeeklyReport =
  vi.mocked(createWeeklyReport);

function AuthenticatedPage() {
  const { login, user } = useAuth();

  if (!user) {
    login({
      id: "user-123",
      username: "supervisor",
      email: "supervisor@example.com",
      role: "supervisor",
    });

    return null;
  }

  return <WeeklyReportPage />;
}

function renderPage() {
  render(
    <AuthProvider>
      <AuthenticatedPage />
    </AuthProvider>
  );
}

describe("WeeklyReportPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the weekly report form", () => {
    renderPage();

    expect(
      screen.getByLabelText(
        /department id/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        /week start/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        /week end/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "button",
        {
          name: /generate report/i,
        }
      )
    ).toBeInTheDocument();
  });

  it("creates and displays a weekly report", async () => {
    mockedCreateWeeklyReport
      .mockResolvedValue({
        _id: "report-123",
        department: "department-123",
        weekStart: "2026-08-02",
        weekEnd: "2026-08-08",
        status: "draft",

        metrics: {
          openedWorkOrders: 4,
          completedWorkOrders: 2,
          overdueWorkOrders: 1,
          openBacklog: 2,
          completionRate: 50,
          totalLaborHours: 12.5,
        },
      });

    const user =
      userEvent.setup();

    renderPage();

    await user.type(
      screen.getByLabelText(
        /department id/i
      ),
      "department-123"
    );

    await user.type(
      screen.getByLabelText(
        /week start/i
      ),
      "2026-08-02"
    );

    await user.type(
      screen.getByLabelText(
        /week end/i
      ),
      "2026-08-08"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: /generate report/i,
        }
      )
    );

    expect(
      mockedCreateWeeklyReport
    ).toHaveBeenCalledWith(
      {
        departmentId:
          "department-123",
        weekStart:
          "2026-08-02",
        weekEnd:
          "2026-08-08",
      },
      "user-123"
    );

    expect(
      await screen.findByText(
        /completion rate: 50%/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /labor hours: 12.5/i
      )
    ).toBeInTheDocument();
  });

  it("shows an error when report creation fails", async () => {
    mockedCreateWeeklyReport
      .mockRejectedValue(
        new Error(
          "Failed to create report"
        )
      );

    const user =
      userEvent.setup();

    renderPage();

    await user.type(
      screen.getByLabelText(
        /department id/i
      ),
      "department-123"
    );

    await user.type(
      screen.getByLabelText(
        /week start/i
      ),
      "2026-08-02"
    );

    await user.type(
      screen.getByLabelText(
        /week end/i
      ),
      "2026-08-08"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: /generate report/i,
        }
      )
    );

    expect(
      await screen.findByText(
        "Failed to create report"
      )
    ).toBeInTheDocument();
  });
});