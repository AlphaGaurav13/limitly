const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;


        if(!authHeader) {
            return res.status(401).json({ error: "No Token" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        req.user = decoded;


        next();
    }catch(err) {
        console.log(err);
        return res.status(403).json("Invalid token");
    }
};