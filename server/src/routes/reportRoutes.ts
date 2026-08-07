import { Router } from "express";

import {
  createWeeklyReport,
  listWeeklyReports,
} from "../controllers/index.js";

import {
  requireAuth,
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
  validateWeeklyReport,
  createWeeklyReport
);

export default router;