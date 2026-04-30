const express = require("express");

const app = express();


const limitRoutes = require("./routes/limit.routes");
const authRoutes = require("./routes/auth.routes");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", limitRoutes);

module.exports = app;