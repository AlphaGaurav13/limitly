const express = require("express");
const router = express.Router();

const {
    generateApiKey,
    getUserKeys,
    deleteKey
} = require("../controllers/apiKey.controller");

const authMiddleware = require("../middlewares/auth.middleware");


router.post("/generate-key", authMiddleware, generateApiKey);
router.get("/keys", authMiddleware, getUserKeys);
router.delete("/keys/:key", authMiddleware, deleteKey);

module.exports = router;