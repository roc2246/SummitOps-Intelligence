import { Router } from "express";

import {
  createWeeklyReport,
} from "../controllers/index.js";

const router = Router();

router.post(
  "/weekly",
  createWeeklyReport
);

export default router;