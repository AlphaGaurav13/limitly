const express = require("express");
const router  = express.Router();

const rateLimit = require("express-rate-limit");

const demoLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,

    message: {
        success: false,
        message: " to many requests. Please try again later."
    }
});


router.get("/test-rate-limit", demoLimiter, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Request successfull"
    });
});


module.exports = router;

