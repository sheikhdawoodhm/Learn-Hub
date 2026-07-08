import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";
import authRoutes from "./routes/authRoutes";
import pool from "./dbSetup/db";
import courseRoutes from "./routes/courseRoutes";
import moduleRoutes from "./routes/moduleRoutes";
import videoRoutes from "./routes/videoRoutes";
import quizRoutes from "./routes/quizRoutes";
import userProgressRoutes from "./routes/progressRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import progressRoutes from "./routes/progressRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import certificateRoutes from "./routes/certificateRoutes";


dotenv.config();

const app = express();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL,
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Permits cookies/authorization headers if needed later
}));

app.use(cookieParser());
app.use(express.json()); // Middleware to parse cookies from incoming requests
app.use("/api/auth", authRoutes);
app.use("/api/courses",courseRoutes);
app.use("/api/modules",moduleRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/user",userProgressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/certificates", certificateRoutes);


app.get("/", (req, res) => {
  res.send("LMS Backend Running (TypeScript)");
});


app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")

    res.json({
      status: "OK",
      db_time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


