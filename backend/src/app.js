import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
  }),
);

// import the routes

import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import noteRouter from "./routes/note.routes.js";
import { cookie } from "express-validator";

import { ApiError } from "./utils/api-error.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Handle mongoose duplicate key error specifically
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      errors: [],
    });
  }

  console.error("Unmarshalable Error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

export default app;
