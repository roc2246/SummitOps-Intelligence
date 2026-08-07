export interface MaintainXWorkOrder {
  id: string;
  title: string;
  description?: string;

  status: string;
  priority?: string;

  location?: string;

  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
  completedAt?: string;
}

export interface WorkdayLaborRecord {
  employeeId: string;

  departmentId?: string;

  workDate: string;

  laborHours: number;

  jobTitle?: string;
  costCenter?: string;
}