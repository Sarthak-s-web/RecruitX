const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/auth.middlewar")
const roleMiddleware = require("../middlewares/role.middleware")

const {applyJob,
    getJobApplication,
    updateApplicationStatus
} = require("../controllers/application.controller")

const upload = require("../middlewares/upload.middleware")

router.post(
    "/:jobId",
    authMiddleware,
    roleMiddleware("JOB_SEEKER"),
    upload.single("resume"),
    applyJob
);


router.get(
    "/job/:jobId",
    authMiddleware,
    roleMiddleware("RECRUITER"),
    getJobApplication
);

router.patch(
    "/:applicationId/status",
    authMiddleware,
    roleMiddleware("RECRUITER"),
    updateApplicationStatus
);



module.exports = router
