import { Router } from "express";

import {
  createWeeklyReport,
  listWeeklyReports,
} from "../controllers/index.js";

import {
  requireAuth,
  requireRole,
  validateWeeklyReport,
} from "../middleware/index.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  listWeeklyReports
);

router.post(
  "/weekly",
  requireAuth,
  requireRole("manager", "admin"),
  validateWeeklyReport,
  createWeeklyReport
);

export default router;