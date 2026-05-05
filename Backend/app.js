const express = require("express");
const cors = require("cors");
const app = express();


const limitRoutes = require("./routes/limit.routes");
const authRoutes = require("./routes/auth.routes");
const apiKeyRoutes = require("./routes/apiKey.routes");
const analyticsRoutes = require("./routes/analytics.routes");

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://limitly-dusky.vercel.app",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", limitRoutes);
app.use("/api", apiKeyRoutes);
app.use("/api", analyticsRoutes);

module.exports = app;