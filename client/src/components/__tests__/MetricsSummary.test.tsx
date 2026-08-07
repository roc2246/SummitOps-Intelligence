import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import MetricsSummary from "../MetricsSummary";

describe("MetricsSummary", () => {
  const metrics = {
    openedWorkOrders: 10,
    completedWorkOrders: 7,
    overdueWorkOrders: 2,
    openBacklog: 3,
    completionRate: 70,
    totalLaborHours: 42.5,
  };

  it("renders the metrics heading", () => {
    render(
      <MetricsSummary
        metrics={metrics}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: /report metrics/i,
      })
    ).toBeInTheDocument();
  });

  it("renders all weekly report metrics", () => {
    render(
      <MetricsSummary
        metrics={metrics}
      />
    );

    expect(
      screen.getByText(/opened: 10/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/completed: 7/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/overdue: 2/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/backlog: 3/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /completion rate: 70%/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /labor hours: 42.5/i
      )
    ).toBeInTheDocument();
  });
});