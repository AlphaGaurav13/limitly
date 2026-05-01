const mongoose = require("mongoose");
const apiKeySchema = new mongoose.Schema({
    key: String,
    userId: String,
    CreatedAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 60
    }
});

module.exports = mongoose.model("ApiKey", apiKeySchema);