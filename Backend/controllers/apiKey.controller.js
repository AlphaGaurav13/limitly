const { createApiKey } = require("../services/config/apiKeyStore");


exports.generateApiKey = async (req, res) => {
    try {
        const userId = req.body.userId || "test-user";
        const apiKey = await createApiKey(userId);
        

        return res.json({ apiKey });
    } catch (err) {
        console.error(err);
        return res.res.status(500).json({
            error: "Failed to generate API key"
        });
    }
};