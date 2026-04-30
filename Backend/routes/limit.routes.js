const  express = require('express');

const router = express.Router();


const { checkLimit } = require("../controllers/limit.controller");

router.post("/check-limit", checkLimit);

module.exports = router;