const express =require("express")
const { registerUser, loginUser, refreshAccessToken, logoutUser} = require("../controllers/auth.controller")

const router = express.Router();

/**
 * - POST api/auth/register
 */
router.post("/register",registerUser)

router.post("/login",loginUser)

router.post("/refresh",refreshAccessToken)

router.post("/logout",logoutUser)
module.exports = router