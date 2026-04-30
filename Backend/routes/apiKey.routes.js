const authMiddleware = require("../middlewares/auth.middleware");

router.post("/generate-key", authMiddleware, generateApiKey);