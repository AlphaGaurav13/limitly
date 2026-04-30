const rateLimiterService = require("../services/rateLimiter/RateLimiterService");
const AnalyticsService  = require("../services/analytics/analyticsService");
exports.checkLimit = async (req, res) => {
    try {
        const {apiKey, endpoint, userId} = req.body;


        if(!apiKey || !endpoint) {
            return res.status(400).json({
                error: "apiKey  and endpoints are required!"
            });
        }
        
        const plan = req.user.plan;

        const result = await rateLimiterService.checkRateLimit({
            apiKey,
            endpoint,
            userId,
            plan
        });

        await analyticsService.track({
            apiKey,
            endpoint,
            userId,
            allowed: result.allowed
        })

        return res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};