const express =require("express")
const { registerUser } = require("../controllers/auth.controller")

const router = express.Router();

/**
 * - POST api/auth/register
 */
router.post("/register",registerUser)

module.exports = router