import { Router } from "express";

import {
  createWeeklyReport,
} from "../controllers/index.js";

import {
  validateWeeklyReport,
} from "../middleware/index.js";

const router = Router();

router.post(
  "/weekly",
  validateWeeklyReport,
  createWeeklyReport
);

export default router;