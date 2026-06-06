import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "@workspace/db";
import { authRouter } from "./routes/auth.js";
import { levelsRouter } from "./routes/levels.js";
import { lessonsRouter } from "./routes/lessons.js";
import { topicsRouter } from "./routes/topics.js";
import { progressRouter } from "./routes/progress.js";
import { quizRouter } from "./routes/quiz.js";
import { booksRouter } from "./routes/books.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "8080", 10);

app.use(express.json());

// Session setup
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

// API routes
app.use("/api/auth", authRouter);
app.use("/api/levels", levelsRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/progress", progressRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/books", booksRouter);

// Health check
app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Serve static client files in production
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
