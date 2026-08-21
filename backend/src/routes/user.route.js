const express = require("express")

const router = express.Router()

const {getProfile} = require("../controllers/user.controller")
const authMiddlewar = require("../middlewares/auth.middlewar")

router.get("/profile", authMiddlewar,getProfile)

module.exports = router;