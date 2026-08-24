const Application = require("../models/application.model")
const Job = require("../models/job.model")
const { uploadResume } = require("../utils/cloudinary")

const applyJob = async(req,res)=>{
    try {
        const { jobId } = req.params
        const {coverLetter} =req.body
        const job =await Job.findById(jobId)

        if(!job){
            return res.status(404).json({
                message:"Job not found"
            })
        }

        const existingApplication = await Application.findOne({
            applicant: req.user.userId,
            job: jobId
        })
        
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job"
            })
        }

        if(!req.file){
            return res.status(400).json({
                message:"Resume is required"
            })
        }

        const result = await uploadResume(req.file.buffer)

        const application = await Application.create({
            applicant: req.user.userId,
            job: jobId,
            resumeUrl:result.secure_url,
            coverLetter
        })



        return res.status(201).json({
            message:"Application submitted successfully",
            application
        })

    } catch (error) {

        console.log("Apply for job error:",error.message);

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

module.exports = {applyJob}