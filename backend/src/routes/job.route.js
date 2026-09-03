const express = require("express")

const router = express.Router()

const { 
    createJob,
    getAllJobs,
    getMyJobs,
    getJobById,
    updateJob,
    deleteJob
    }
    =require("../controllers/job.controller")
const authMiddleware = require("../middlewares/auth.middlewar")
const roleMiddleware = require("../middlewares/role.middleware")

router.post("/" ,authMiddleware,roleMiddleware("RECRUITER"), createJob);

router.get("/",authMiddleware, getAllJobs)

router.get(
    "/my",
    authMiddleware,
    roleMiddleware("RECRUITER"),
    getMyJobs
);

router.get("/:id",authMiddleware,getJobById)

router.patch("/:id",authMiddleware,roleMiddleware("RECRUITER"), updateJob)

router.delete("/:id",authMiddleware,roleMiddleware("RECRUITER"),deleteJob)

module.exports = router;
