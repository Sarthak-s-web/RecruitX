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
            message:"Profile fetched Successful",
            user
        })
    } catch (error) {
        console.log("Get profile error:",error.message);
        
        return res.status(500).json({
            message:"Server error"
        })
    }
}

module.exports = {
    getProfile
}