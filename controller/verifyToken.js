const jwt = require('jsonwebtoken');

const TOKEN_SECRET = "sdfjkshdfweirowe"

function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Access Denied");

    try {
        const verified = jwt.verify(token, TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.clearCookie("token");
        res.status(400).send("Invalid Token");
    }
}

module.exports = auth;