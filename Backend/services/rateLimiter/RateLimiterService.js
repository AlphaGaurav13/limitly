const SlidingWindowLog = require("./strategies/SlidingWindowLog");


// const RATE_LIMIT_CONFIG =  {
//     default: {
//         limit: 5,
//         window: 60000
//     },

//     pro123: {
//         limit: 100,
//         window: 60000
//     }
// };

const  PLAN_CONFIG = {
    free: {
        limit: 5,
        window: 60000 
    },
    pro: {
        limit: 100,
        window: 60000
    }
}

class RateLimiterService {
    constructor() {
        this.strategy =  new SlidingWindowLog();
    }

    getConfig(plan) {
        return PLAN_CONFIG[plan] || PLAN_CONFIG["free"]
    }


    generateKey( {apiKey, endpoint, userId}) {
        return `rl:${apiKey}:${endpoint}:${userId || "global"}`;
    }

    async checkRateLimit({apiKey, endpoint, userId, plan} ) {
        const { limit, window } = this.getConfig(plan);

        const  key = this.generateKey({ apiKey, endpoint, userId });

        return this.strategy.checkLimit(key, limit, window);
    }
}


module.exports = new RateLimiterService();