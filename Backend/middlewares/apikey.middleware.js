const { getApiKeyData } = require("../services/config/apiKeyStore");


module.exports = async (req, res, next) => {
    try {
        const apiKey = req.body.apiKey;

        if(!apiKey) {
            return res.status(401).json({
                error: "API key is required"
            });
        }

        const data = await getApiKeyData(apiKey);

        if(!data || !data.active) {
            return res.status(403).json({
                error : "Invalid API key"
            });
        }

        req.user = data;
        next();


    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: "Auth error"
        })
    }
}