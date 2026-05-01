const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    plan:  {
        type: String,
        default: "free"
    }
});

module.exports = mongoose.model("user", userSchema);