class RateLimiterStrategy {
    async checkLimit(key, limit, window) {
        throw new Error("checkLimit() must be implemented");
    }
}


module.exports = RateLimiterStrategy;