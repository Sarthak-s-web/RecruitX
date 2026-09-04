const Job = require("../models/job.model")
const Application = require("../models/application.model")
const mongoose = require("mongoose")

const escapeRegex = (str) => {
    if (typeof str !== "string") return "";
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

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

        if(!title || typeof title !== "string" || !title.trim() ||
           !company || typeof company !== "string" || !company.trim() ||
           !description || typeof description !== "string" || !description.trim() ||
           !location || typeof location !== "string" || !location.trim() ||
           salary === undefined || !skills || !jobType)
        {
            return res.status(400).json({
                message: "All fields are required and must be valid non-empty values"
            })
        }

        if (title.trim().length > 200 || company.trim().length > 100 || location.trim().length > 200 || description.trim().length > 10000) {
            return res.status(400).json({
                message: "One or more text fields exceed maximum allowed length"
            });
        }

        if (typeof salary !== "number" || isNaN(salary) || salary < 0) {
            return res.status(400).json({
                message: "Salary must be a valid positive number"
            });
        }

        if (!Array.isArray(skills)) {
            return res.status(400).json({
                message: "Skills must be an array"
            });
        }

        const sanitizedSkills = skills.map(s => typeof s === "string" ? s.trim() : "").filter(Boolean);
        if (sanitizedSkills.length === 0) {
            return res.status(400).json({
                message: "Skills must contain at least one valid skill"
            });
        }

        if (typeof jobType !== "string") {
            return res.status(400).json({
                message: "Job type must be a string"
        });
}
        const normalizedJobType = jobType.toUpperCase();

        const allowedJobTypes = [
            "FULL_TIME",
            "PART_TIME",
            "INTERNSHIP"
        ];

        if (!allowedJobTypes.includes(normalizedJobType)) {
            return res.status(400).json({
                message: "Invalid job type"
            });
        }

        const job = await Job.create({
            title: title.trim(),
            company: company.trim(),
            description: description.trim(),
            location: location.trim(),
            salary,
            skills: sanitizedSkills,
            jobType:normalizedJobType,
            createdBy:req.user.userId
        });

        return res.status(201).json({
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

        const {search, location,jobType,skills} = req.query

        let filter ={}

        if(search && typeof search === "string" && search.trim()){
            const escapedSearch = escapeRegex(search.trim());
            filter = {
                $or:[
                    {
                        title:{
                            $regex: escapedSearch,
                            $options:"i"
                        },
                    },
                    {
                        company:{
                            $regex: escapedSearch,
                            $options: "i"
                        }
                    }
                ]
            }
        }

        if(location && typeof location === "string" && location.trim()){
            filter.location ={
                $regex: escapeRegex(location.trim()),
                $options:"i"
            }
        }
        
        if(jobType && typeof jobType === "string" && jobType.trim()){
            filter.jobType = jobType.trim().toUpperCase()
        }

        if(skills && typeof skills === "string" && skills.trim()){
            filter.skills = {
                $regex: escapeRegex(skills.trim()),
                $options:"i"
            }
        }

        const jobs = await Job.find(filter).select("-createdBy")

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

const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            createdBy: req.user.userId
        }).select("-createdBy");

        const jobsWithApplications = await Promise.all(
            jobs.map(async (job)=>{

                const applicationCount = await Application.countDocuments({
                    job:job._id
                })

                return{
                    ...job.toObject(),
                    applicationCount
                }
            })
        )

        return res.status(200).json({
            message: "Your jobs fetched successfully",
            jobs:jobsWithApplications
        });

    } catch (error) {
        console.log("Get my jobs error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getJobById = async(req,res)=>{

    try {

        const {id} = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(id)
            .populate("createdBy", "name email");

        if(!job){
            return res.status(404).json({
                message:"Job not found"
            })
        }

        const jobData = job.toObject();

        jobData.recruiter = jobData.createdBy;
        delete jobData.createdBy;

        return res.status(200).json({
            message:"Job fetched successfully",
            job: jobData
        })

    } catch (error) {
        console.log("Get job by id error:",error);

        return res.status(500).json({
            message:"Internal Server error"
        })
    }
}

const updateJob = async(req,res)=>{
    try {
        const{ id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }
    
        const {
                title,
                company,
                description,
                location,
                salary,
                skills,
                jobType
            } = req.body;
    
        const job = await Job.findById(id)
    
        if(!job){
            return res.status(404).json({
                message:"Job not found"
            })
        }
    
        if(job.createdBy.toString() !== req.user.userId){
            return res.status(403).json({
                message:"You are not allowed to update this job"
            })
        }

        if (salary !== undefined) {
            if (typeof salary !== "number" || salary < 0) {
                return res.status(400).json({
                    message: "Salary must be a valid positive number"
                });
            }
        }

        let sanitizedSkills;
        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    message: "Skills must be an array"
                });
            }
            sanitizedSkills = skills.map(s => typeof s === "string" ? s.trim() : "").filter(Boolean);
            if (sanitizedSkills.length === 0) {
                return res.status(400).json({
                    message: "Skills must contain at least one valid skill"
                });
            }
        }

        if (title !== undefined && (typeof title !== "string" || !title.trim() || title.trim().length > 200)) {
            return res.status(400).json({
                message: "Title cannot be empty or exceed 200 characters"
            });
        }

        if (company !== undefined && (typeof company !== "string" || !company.trim() || company.trim().length > 100)) {
            return res.status(400).json({
                message: "Company cannot be empty or exceed 100 characters"
            });
        }

        if (description !== undefined && (typeof description !== "string" || !description.trim() || description.trim().length > 10000)) {
            return res.status(400).json({
                message: "Description cannot be empty or exceed 10000 characters"
            });
        }

        if (location !== undefined && (typeof location !== "string" || !location.trim() || location.trim().length > 200)) {
            return res.status(400).json({
                message: "Location cannot be empty or exceed 200 characters"
            });
        }

        let normalizedJobType;

        if (jobType !== undefined) {

            if (typeof jobType !== "string") {
                return res.status(400).json({
                    message: "Job type must be a string"
                });
            }   

            normalizedJobType = jobType.toUpperCase();

            const allowedJobTypes = [
                "FULL_TIME",
                "PART_TIME",
                "INTERNSHIP"
            ];

            if (!allowedJobTypes.includes(normalizedJobType)) {
                return res.status(400).json({
                    message: "Invalid job type"
                });
            }
        }
    
        if (title !== undefined) job.title = title.trim();
        if (company !== undefined) job.company = company.trim();
        if (description !== undefined) job.description = description.trim();
        if (location !== undefined) job.location = location.trim();
        if (salary !== undefined) job.salary = salary;
        if (sanitizedSkills !== undefined) job.skills = sanitizedSkills;
        if (normalizedJobType !== undefined) job.jobType = normalizedJobType;

        await job.save();

        const updatedJob = job.toObject();
        delete updatedJob.createdBy;
    
        return res.status(200).json({
            message:"Job updated successfully",
            job:updatedJob
        })
    
    } catch (error) {
        console.log("Update Job error",error);

        return res.status(500).json({
            message:"Internal Server error"
        })
        
    }

}

const deleteJob = async(req, res)=>{
    try {
        
        const { id } = req.params

         if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(id)

        if(!job){
            return res.status(404).json({
                message:"Job not found"
            })
        }

        if(job.createdBy.toString() !== req.user.userId){
            return res.status(403).json({
                message:"You are not allowed to delete this job"
            })
        }

        await Application.deleteMany({ job: id });
        await Job.findByIdAndDelete(id)

        return res.status(200).json({
            message:"Job deleted successfully"
        });

    } catch (error) {
        console.log("Delete job error: ", error.message);

        return res.status(500).json({
            message:"Internal server error"
        })
    }
};


module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
}