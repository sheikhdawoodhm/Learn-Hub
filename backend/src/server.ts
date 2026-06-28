import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import pool from "./configure/db";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀 (TypeScript)");
});

// TEST DB CONNECTION (important for you)
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