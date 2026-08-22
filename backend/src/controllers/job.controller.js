const Job = require("../models/job.model")

const createJob = async(req,res)=>{
    try {
        
        const { 
            title,
            company,
            description,
            location,
            salary,
            skills,
            jobType
        } = req.body

        if(!title || !company || !description || !location || !salary || !skills || !jobType)
        {
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const job = await Job.create({
            title,
            company,
            description,
            location,
            salary,
            skills,
            jobType,
            createdBy:req.user.userId
        });

        return res.status(200).json({
            message:"Job created successfully"
        })

    } catch (error) {
        console.log("Create Job error:" , error.message);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getAllJobs = async(req,res)=>{
    try {

        const jobs = await Job.find() .select("-createdBy").sort({createdAt:-1})

        return res.status(200).json({
            message:"Jobs fetched successfully",
            jobs
        })


    } catch (error) {
        console.log("Get all jobs error",error);
        return res.status(500).json({
            message:"Internal Server error"
        })
    }
};


module.exports = {
    createJob,
    getAllJobs
}