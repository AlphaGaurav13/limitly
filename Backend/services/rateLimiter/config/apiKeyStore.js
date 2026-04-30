const crypto = require("crypto")
const { client } = require("../../db/redisClient");


function generateApiKey() {
    return crypto.randomBytes(16).toString("hex");
}

async function createApiKey(userId) {
    const apiKey = generateApiKey();
    const data = {
        userId,
        plan: "free",
        createdAt: Date.now(),
        active: true
    };


    await client.set(
        `apikey:${apiKey}`,
        JSON.stringify(data)
    );


    return apiKey;
}

async function getApiKeyData(apiKey) {
    const data = await client.get(`apikey:${apiKey}`);
    return data ? JSON.parse(data) : null;
}


module.exports = {
    createApiKey,
    getApiKeyData
};