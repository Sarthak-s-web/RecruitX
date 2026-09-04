const express = require("express")

const router = express.Router()

const { getProfile, updateProfile } = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middlewar")

router.get("/profile", authMiddleware, getProfile)
router.patch("/profile", authMiddleware, updateProfile)

module.exports = router;