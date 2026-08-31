const Application = require("../models/application.model")
const Job = require("../models/job.model")
const { uploadResume } = require("../utils/cloudinary")

const mongoose = require("mongoose")

const applyJob = async(req,res)=>{
    try {
        const { jobId } = req.params

        if (!mongoose.isValidObjectId(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

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

const getJobApplication = async(req,res)=>{

    try {
        const {jobId} = req.params

        if (!mongoose.isValidObjectId(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }
    
        const job = await Job.findById(jobId)
    
        if(!job){
            return res.status(404).json({
                message:"Job not found"
            })
        }
    
        if(job.createdBy.toString()!== req.user.userId){
            return res.status(403).json({
                message:"You are not allowed to view application for this job"
            })
        }
    
        const application = await Application.find({
            job:jobId
        }).populate("applicant","name email")
        .select("-__v")
    
        return res.status(200).json({
            message:"Application fetched successfully",
            application
        })
    } catch (error) {
        console.log("Get job application error:",error.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

const updateApplicationStatus = async(req,res)=>{

    try {
        const {applicationId} = req.params;

        if (!mongoose.isValidObjectId(applicationId)) {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        const {status } = req.body
        
        const application = await Application.findById(applicationId)
    
        if(!application){
            return res.status(404).json({
                message:"Application does not exists"
            })
        }
    
        const job = await Job.findById(application.job)
    
        if(!job){
            return res.status(404).json({
                message:"Job does not exists"
            })
        }
    
        if(job.createdBy.toString()!=req.user.userId){
            return res.status(403).json({
                message:"You are not allowed to make changes"
            })
        }

        const normalizedStatus = status?.toUpperCase();

    
        const allowedStatus = [
            "APPLIED",
            "SHORTLISTED",
            "REJECTED",
            "HIRED"
        ];
    
        if(!allowedStatus.includes(normalizedStatus)){
            return res.status(400).json({
                message: "Invalid application status"
            })
        }
    
        application.status = normalizedStatus;
    
        await application.save();
    
        return res.status(200).json({
            message:"Application status updated successfully",
            application
        });

    } catch (error) {

        console.log("Update Application Status error:",error.message);
        return res.status(500).json({
            message:"Internal Server error"
        })
    }
}

const getMyApplication = async(req,res)=>{

    try {
        const userId = req.user.userId
    
        const applications = await Application.find({
            applicant:userId
        }).populate("job", "title company location jobType salary").select("-__v");
        
    
        return res.status(200).json({
            message:"Applications fetched successfully",
            applications
        })
    
    } catch (error) {
        console.log("Get my application error:",error.message);
        return res.status(500).json({
            message:"Internal Server error"
        })
    }
}

const getRecruiterDashboard = async(req,res)=>{
    try {

        const jobs = await Job.find({
            createdBy:req.user.userId
        })

        const jobIds = jobs.map((job)=> job._id)

        const totalJobs = jobs.length;

        const totalApplications = await Application.countDocuments({
            job:{
                $in:jobIds
            }
        });

        const shortlisted = await Application.countDocuments({
            job:{
                $in:jobIds
            },
            status:"SHORTLISTED"
        })

        const rejected = await Application.countDocuments({
            job:{
                $in:jobIds
            },
            status:"REJECTED"
        })

        const hired = await Application.countDocuments({
            job:{
                $in:jobIds
            },
            status:"HIRED"
        })

        return res.status(200).json({
            message:"Recruiter dashboard fetched successfully",
            dashboard:{
                totalJobs,
                totalApplications,
                shortlisted,
                hired,
                rejected
            }
            
        })

        
    } catch (error) {
        console.log("Get recruiter dashboard error:",error.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

module.exports = {
    applyJob,
    getJobApplication,
    updateApplicationStatus,
    getMyApplication,
    getRecruiterDashboard
}