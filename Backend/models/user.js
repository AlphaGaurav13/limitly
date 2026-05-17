const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    plan:  {
        type: String,
        default: "free"
    }
});

module.exports = mongoose.model("user", userSchema);