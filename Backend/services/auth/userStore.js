const { client } = require("../../db/redisClient");
const bcrypt = require("bcrypt");


async function createUser(email, password) {
    const hashed = await bcrypt.hash(password, 10);


    const user = {
        email,
        password: hashed,
        createAt: Date.now()
    };

    await client.set(`user:${email}`, JSON.stringify(user));

    return { email };
}

async function getUser(email) {
    const data = await client.get(`user:${email}`);
    return data ? JSON.parse(data) : null;
}


module.exports = {
    createUser,
    getUser
}