const jwt = require('jsonwebtoken');
const { mysqlPromise } = require("../connection/db")
const authMiddleware = async (req, res, next) => {
    let options = {
        httpOnly: true,
        secure: false,
    };
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized Request" });
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.clearCookie("accessToken", options).status(401).json({ message: "Invalid Access Token" });
        }

        const query = `SELECT users.id, username, email FROM users WHERE id = ?`;
        const [[user]] = await mysqlPromise.execute(query, [decodedToken.id]);
        if (!user) return res.clearCookie("accessToken", options).status(401).json({ message: "Invalid Access Token" });

        req.user = {
            email: user.email,
            id: user.id,
            username: user.username
        };

        next();
    } catch (error) {
        return res.clearCookie("accessToken", options).status(401).json({ message: "Invalid Access Token" });
    }
};

module.exports = authMiddleware;
