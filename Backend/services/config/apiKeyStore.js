const crypto = require("crypto")
const ApiKey = require("../../models/ApiKey");
const { client } = require("../../db/redisClient");

function generateApiKey() {
    return crypto.randomBytes(16).toString("hex");
}

async function canGenerateKey(userId) {
    const today = new Date().toISOString().split("T")[0];
    const key = `apikey_limit:${userId}:${today}`;

    const count = await client.incr(key);

    if (count === 1) {
        await client.expire(key, 86400);
    }

    return count <= 3;
}

async function createApiKey(userId) {
    const apiKey = generateApiKey();

    console.log(" SAVING KEY FOR:", userId);
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
    const saved = await ApiKey.create({
        key: apiKey,
        userId
    });

    console.log("SAVED:", saved);


    return apiKey;
}

async function getUserApiKeys(userId) {
    console.log("FETCHING FOR:", userId);
    const keys = await ApiKey.find({ userId });
    console.log("FOUND:", keys);
    return keys;
}

async function getApiKeyData(apiKey) {
    const data = await client.get(`apikey:${apiKey}`);
    return data ? JSON.parse(data) : null;
}


async function deleteApiKey(userId, key) {
    await ApiKey.deleteOne({ userId, key });

    await client.del(`apikey:${key}`);
}


module.exports = {
    createApiKey,
    getApiKeyData,
    canGenerateKey,
    getUserApiKeys,
    deleteApiKey
};