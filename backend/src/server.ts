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


dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // URL of your frontend application
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



