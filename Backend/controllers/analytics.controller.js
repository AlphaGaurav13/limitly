const analyticsService = require("../services/analytics/analyticsService");

exports.getAnalytics = async (req, res) => {
    try {
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({
                error: "apiKey is required"
            });
        }

        const data = await analyticsService.getAnalytics(apiKey);

        return res.json(data);
    } catch (err) {
        console.log("ANALYTICS ERROR:", err);
        return res.status(500).json({
            error: "Failed to fetch analytics"
        });
    }
};