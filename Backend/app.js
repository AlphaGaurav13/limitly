const express = require("express");
const cors = require("cors");
const app = express();

const healthRoutes = require("./routes/healthRoutes");
const limitRoutes = require("./routes/limit.routes");
const authRoutes = require("./routes/auth.routes");
const apiKeyRoutes = require("./routes/apiKey.routes");
const analyticsRoutes = require("./routes/analytics.routes");

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://limitly-dusky.vercel.app",
            process.env.FRONTEND_URL
        ].filter(Boolean);

        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Allow any Vercel preview deployment
        if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", limitRoutes);
app.use("/api", apiKeyRoutes);
app.use("/api", analyticsRoutes);

module.exports = app;