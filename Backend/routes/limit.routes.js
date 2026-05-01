const  express = require('express');

const router = express.Router();


const { checkLimit } = require("../controllers/limit.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.post("/check-limit", authMiddleware, checkLimit);

module.exports = router;