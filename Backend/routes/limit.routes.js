const  express = require('express');

const router = express.Router();


const { checkLimit } = require("../controllers/limit.controller");
const apiKeyMiddleware = require("../middlewares/apikey.middleware");


router.post("/check-limit", apiKeyMiddleware, checkLimit);

module.exports = router;