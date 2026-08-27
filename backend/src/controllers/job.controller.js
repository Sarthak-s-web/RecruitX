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

        const {search, location,jobType,skills} = req.query

        let filter ={}

        if(search){
            filter = {
                $or:[
                    {
                        title:{
                            $regex:search,
                            $options:"i"
                        },
                    },
                    {
                        company:{
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            }
        }

        if(location){
            filter.location ={
                        $regex:location,
                        $options:"i"
                    }
        }
        
        if(jobType){
            filter.jobType = jobType.toUpperCase()
        }

        if(skills){
            filter.skills = {
                $regex:skills,
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

const getJobById = async(req,res)=>{

    try {

        const {id} = req.params

        const job = await Job.findById(id).select("-createdBy")
        
        if(!job){
            return res.status(400).json({
                message:"Job not found"
            })
        }

        return res.status(200).json({
            message:"Job fetched successfully",
            job
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
    
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            {
                title,
                company,
                description,
                location,
                salary,
                skills,
                jobType  
            },
             {
                returnDocument: "after",
                runValidators: true
            }
        ).select("-createdBy")
    
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
    deleteJob
}