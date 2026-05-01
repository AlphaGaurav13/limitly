const jwt = require('jsonwebtoken');


function generateToken(user) {
    return jwt.sign(
        { userId: user._id || user.email,  plan: user.plan || "free" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
    generateToken,
    verifyToken
};

