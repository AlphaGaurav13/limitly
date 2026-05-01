const { client } = require("../../db/redisClient");

class AnalyticsService {
    async track({ apiKey, endpoint, userId, allowed }) {
        const baseKey = `analytics:${apiKey}`;

        // total requests
        await client.incr(`${baseKey}:total`);

        if (allowed) {
            await client.incr(`${baseKey}:allowed`);
        } else {
            await client.incr(`${baseKey}:blocked`);
        }

        // endpoint tracking
        if (endpoint) {
            await client.zIncrBy(`${baseKey}:endpoint`, 1, endpoint);
        }

        // user tracking
        if (userId) {
            await client.zIncrBy(`${baseKey}:user`, 1, userId);
        }
    }

    async getAnalytics(apiKey) {
        const baseKey = `analytics:${apiKey}`;

        const total = Number(await client.get(`${baseKey}:total`) || 0);
        const allowed = Number(await client.get(`${baseKey}:allowed`) || 0);
        const blocked = Number(await client.get(`${baseKey}:blocked`) || 0);

        // USERS
        const users = await client.zRange(`${baseKey}:user`, 0, -1);
        const topUsers = [];

        for (let user of users) {
            const score = await client.zScore(`${baseKey}:user`, user);
            topUsers.push({
                userId: user,
                count: Number(score)
            });
        }

        // ENDPOINTS
        const endpoints = await client.zRange(`${baseKey}:endpoint`, 0, -1);
        const topEndpoints = [];

        for (let ep of endpoints) {
            const score = await client.zScore(`${baseKey}:endpoint`, ep);
            topEndpoints.push({
                endpoint: ep,
                count: Number(score)
            });
        }

        return {
            total,
            allowed,
            blocked,
            topUsers,
            topEndpoints
        };
    }
}

module.exports = new AnalyticsService();