import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDatabase } from "./config/database.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/index.js";

import healthRouter from "./routes/health.routes.js";

import {
  authRoutes,
  reportRoutes,
} from "./routes/index.js";

dotenv.config();

const app = express();

const port =
  Number(process.env.PORT) || 5000;

const mongoUri =
  process.env.MONGODB_URI ??
  "mongodb://127.0.0.1:27017/mern_app";

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ??
      "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    message: "MERN API is running",
  });
});

app.use(
  "/api/health",
  healthRouter
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(notFoundHandler);

app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDatabase(mongoUri);

  app.listen(port, () => {
    console.log(
      `Server running at http://localhost:${port}`
    );
  });
}

void startServer();