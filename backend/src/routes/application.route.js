const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/auth.middlewar")
const roleMiddleware = require("../middlewares/role.middleware")

const {applyJob } = require("../controllers/application.controller")

const upload = require("../middlewares/upload.middleware")

router.post(
    "/:jobId",
    authMiddleware,
    roleMiddleware("JOB_SEEKER"),
    upload.single("resume"),
    applyJob
);

module.exports = router
