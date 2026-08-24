const express = require("express")

const router = express.Router()

const { 
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
    }
    =require("../controllers/job.controller")
const authMiddlewar = require("../middlewares/auth.middlewar")
const roleMiddleware = require("../middlewares/role.middleware")

router.post("/" ,authMiddlewar,roleMiddleware("RECRUITER"), createJob);

router.get("/",authMiddlewar, getAllJobs)

router.get("/:id",getJobById)

router.patch("/:id",authMiddlewar,roleMiddleware("RECRUITER"), updateJob)

router.delete("/:id",authMiddlewar,roleMiddleware("RECRUITER"),deleteJob)

module.exports = router;
