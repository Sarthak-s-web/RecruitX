const express = require("express")
const multer = require("multer");
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middlewar")
const roleMiddleware = require("../middlewares/role.middleware")

const {applyJob,
    getJobApplication,
    updateApplicationStatus,
    getMyApplication,
    getRecruiterDashboard
} = require("../controllers/application.controller")

const upload = require("../middlewares/upload.middleware")

const uploadResume = (req, res, next) => {

    upload.single("resume")(req, res, (error) => {

        if (error instanceof multer.MulterError) {

            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "Resume file must be less than 5 MB"
                });
            }

            return res.status(400).json({
                message: error.message
            });
        }

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        next();
    });
};


router.post(
    "/:jobId",
    authMiddleware,
    roleMiddleware("JOB_SEEKER"),
    uploadResume,
    applyJob
);


router.get(
    "/job/:jobId",
    authMiddleware,
    roleMiddleware("RECRUITER"),
    getJobApplication
);

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("RECRUITER"),
    getRecruiterDashboard
);

router.patch(
    "/:applicationId/status",
    authMiddleware,
    roleMiddleware("RECRUITER"),
    updateApplicationStatus
);

router.get("/my",authMiddleware, roleMiddleware("JOB_SEEKER"),getMyApplication)




module.exports = router
