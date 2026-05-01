const { createApiKey, getUserApiKeys,deleteApiKey,canGenerateKey } = require("../services/config/apiKeyStore");


exports.generateApiKey = async (req, res) => {
    try {
        const userId = req.user.userId;

        const allowed = await canGenerateKey(userId);

        if (!allowed) {
            return res.status(400).json({
                error: "Max 3 API keys per day allowed"
            });
        }

        const apiKey = await createApiKey(userId);

        res.json({ apiKey });

    } catch (err) {
        // console.log(err);
        // res.status(500).json({ error: "Failed to generate key" });
        console.log("USER:", req.user);
        console.log("ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getUserKeys = async (req, res) => {
    try {
        const userId = req.user.userId;

        const keys = await getUserApiKeys(userId);

        res.json(keys);

    } catch (err) {
        // res.status(500).json({ error: "Failed to fetch keys" });
        console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
    }
};


exports.deleteKey = async (req, res) => {
    try {
        const userId = req.user.userId;
        const key = req.params.key;

        await deleteApiKey(userId, key);

        res.json({ message: "Deleted" });

    } catch (err) {
        // res.status(500).json({ error: "Failed to delete key" });
        console.log("ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};