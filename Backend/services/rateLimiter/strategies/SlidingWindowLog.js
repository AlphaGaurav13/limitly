const RateLimiterStrategy = require("./RateLimiterStrategy");
const { client } = require("../../../db/redisClient");


const SLIDING_WINDOW_LUA = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local limit = tonumber(ARGV[3])

    local window_start = now - window
    redis.call('ZREMRANGEBYSCORE', key, 0, window_start)


    local count = redis.call('ZCARD', key)

    if count >= limit then 
        local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
        local oldest_ts = tonumber(oldest[2]) or now
        return {0, count, oldest_ts}
    end

    local seq = redis.call('INCR', key .. ':seq')
    redis.call('ZADD', key, now, tostring(now) .. '-' .. tostring(seq))


 
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    redis.call('EXPIRE', key .. ':seq', math.ceil(window / 1000))
    


    return {1, count + 1, 0}
`;

class SlidingWindowLog extends RateLimiterStrategy {
    async checkLimit(key, limit, window) {
        const now = Date.now();

        const result = await client.eval(SLIDING_WINDOW_LUA, {
            keys: [key],
            arguments: [String(now), String(window), String(limit)]
        });

        const allowed = result[0] === 1;
        const count = result[1];
        const oldest = result[2];

        if(!allowed) {
            const retryAfter = Math.max(
                0,
                Math.ceil((oldest + window - now) / 1000)
            );
            return {
                allowed: false,
                retryAfter
            };
        }


        return {
            allowed: true,
            remaining: limit - count,
            retryAfter: 0
        };   
    }
}

module.exports = SlidingWindowLog;