/* eslint-env node */
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://citriq-react.vercel.app"
        ],
        credentials: true
    })
);
app.use(express.json());


app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ status: "connected", time: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

import { verifyToken } from "./middleware/authMiddleware.js";

app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Protected route working", user: req.user });
});

import submissionRoutes from "./routes/submissionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
    console.log(`Backend running on http://localhost:${PORT}`)
);
