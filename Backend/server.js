require("dotenv").config();

const app  = require("./app");
const connectMongo = require("./db/mongo");
const { connectRedis } = require("./db/redisClient");
const PORT = process.env.PORT || 3000;


(async () => {
    await connectMongo();
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();