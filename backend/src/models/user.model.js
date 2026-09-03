const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    passwordHash:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        enum:["JOB_SEEKER","RECRUITER","ADMIN"],
        default:"JOB_SEEKER"
    }
}, { timestamps:true } )

const User = mongoose.model("User",userSchema)

module.exports = User