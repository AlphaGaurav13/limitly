const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../controllers/analytics.controller");

router.post("/analytics", getAnalytics);

module.exports = router;