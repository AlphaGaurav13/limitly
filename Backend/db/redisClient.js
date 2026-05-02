const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const clientOptions = {
    url: redisUrl
};

// Upstash uses TLS (rediss://) — enable TLS support
if (redisUrl.startsWith("rediss://")) {
    clientOptions.socket = {
        tls: true,
        rejectUnauthorized: false
    };
}

const client = createClient(clientOptions);

client.on("error", (err) => {
    console.log("Redis Error:", err.message)
});

async function connectRedis() {
    await client.connect();
    console.log("Redis connected to:", redisUrl.includes("upstash") ? "Upstash (cloud)" : "Local");
};


module.exports = { client, connectRedis  };