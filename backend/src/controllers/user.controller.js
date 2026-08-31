const User = require("../models/user.model")

const getProfile = async(req,res)=>{

    try {
        const userId = req.user.userId
    
        const user = await User.findById(userId)
    
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
    
        return res.status(200).json({
            message:"Profile fetched Successfully",
            user
        })
    } catch (error) {
        console.log("Get profile error:",error.message);
        
        return res.status(500).json({
            message:"Internal Server error"
        })
    }
}

const updateProfile = async(req,res)=>{
    try {

        const userId = req.user.userId

        const {name, email} = req.body

        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        if(name){
            user.name= name
        }

        if(email){
            user.email = email
        }

        await user.save()

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.log("Update Profile error:", error.message);

         if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


module.exports = {
    getProfile,
    updateProfile
}