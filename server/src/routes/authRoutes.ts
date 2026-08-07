import {
  Router,
} from "express";

import {
  loginPlaceholder,
} from "../controllers/index.js";

const router = Router();

router.post(
  "/login",
  loginPlaceholder
);

export default router;