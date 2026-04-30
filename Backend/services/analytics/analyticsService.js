const { client } = require("../../db/redisClient");


class AnalyticsService {
    async  track({apiKey, endpoint, userId, allowed}) {
        const baseKey  = `analytics:${apiKey}`;


        // total Request
        await client.incr(`${baseKey}:total`);

        if(allowed) {
            await client.incr(`${baseKey}:allowed`);
        }else {
            await client.incr(`${baseKey}:blocked`);
        }

        // endpoint tracking 
        await client.zIncrBy(
            `${baseKey}:endpoints`,
            1,
            endpoint
        );

        // user usage 

        if(userId) {
            await client.zIncrBy(
                `${baseKey}:user`,
                1,
                userId
            );
        }
    }
}


module.exports = new AnalyticsService();