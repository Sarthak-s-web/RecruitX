const { application } = require("express");
const mongoose = require("mongoose")

const applicationSchema  = new mongoose.Schema({
    applicant:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    resumeUrl:{
        type:String,
        required: true
    },

    coverLetter:{
        type: String
    },

    status:{
        type:String,
        enum:[
            "APPLIED",
            "SHORTLISTED",
            "REJECTED",
            "HIRED"
        ],
        default:"APPLIED"
    }
},{timestamps:true}
);

applicationSchema.index(
    {applicant:1, job:1},
    {unique:true}
);

const Application = mongoose.model("Application",applicationSchema)

module.exports = Application