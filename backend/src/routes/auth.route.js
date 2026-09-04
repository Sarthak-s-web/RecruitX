const express = require("express");
const { registerUser, loginUser, refreshAccessToken, logoutUser } = require("../controllers/auth.controller");

const router = express.Router();

// Minimal in-memory rate limiter for auth routes (zero external dependencies)
const rateLimitMap = new Map();
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 10 * 60 * 1000).unref();

const authRateLimiter = (maxRequests = 20, windowMs = 15 * 60 * 1000) => (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || "unknown";
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
    }

    if (record.count >= maxRequests) {
        return res.status(429).json({
            message: "Too many attempts, please try again later"
        });
    }

    record.count += 1;
    next();
};

/**
 * - POST api/auth/register
 */
router.post("/register", authRateLimiter(20), registerUser);

router.post("/login", authRateLimiter(20), loginUser);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutUser);

module.exports = router;