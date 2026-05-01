const mongoose = require("mongoose");

async function  connectMongo() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected");
    } catch(err) {
        console.log(console.log);
        process.exit(1);
    }
}

module.exports = connectMongo;