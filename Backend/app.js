const express = require("express");
const  passport = require("passport");
const session = require("express-session");
require("./config/passport");

const cors = require("cors");
const app = express();

const googleAuthRoutes = require("./routes/googleAuth.routes");
const healthRoutes = require("./routes/healthRoutes");
const limitRoutes = require("./routes/limit.routes");
const authRoutes = require("./routes/auth.routes");
const apiKeyRoutes = require("./routes/apiKey.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const demoRateLimiter = require("./routes/demoRateLimiter");



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


app.use(session({
    secret: "limitlysecrey",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/api/auth", googleAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", limitRoutes);
app.use("/api", demoRateLimiter);
app.use("/api", apiKeyRoutes);
app.use("/api", analyticsRoutes);

module.exports = app;