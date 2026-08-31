const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    company:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true   
    },
    location:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    jobType:{
        type:String,
        enum:["FULL_TIME", "PART_TIME", "INTERNSHIP"],
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},
{timestamps:true}
)

const Job = mongoose.model("Job",jobSchema)

module.exports = Job