const { createUser, getUser } = require("../services/auth/userStore");
const bcrypt = require("bcrypt");

const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;


        const existing  = await getUser(email);

        if(existing) {
            return res.status(500).json({ error: "User already exists" });
        }

        const user = await createUser(email, password);

        return res.json({
            message: "User registered",
            user
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Register failed"});
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUser(email);

        if(!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) {
            return res.status(400).json({ error: "Invalid credentials" });
        } 

        const token = generateToken(user);
        return res.json({ token });
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: "Login failed" });
    }
}