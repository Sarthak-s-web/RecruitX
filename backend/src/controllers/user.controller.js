const User = require("../models/user.model")

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
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

        if(name !== undefined){
            if (typeof name !== "string" || !name.trim() || name.trim().length < 2 || name.trim().length > 100) {
                return res.status(400).json({
                    message: "Name must be between 2 and 100 characters"
                });
            }
            user.name = name.trim();
        }

        if(email !== undefined){
            if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
                return res.status(400).json({
                    message: "A valid email address is required"
                });
            }
            user.email = email.trim().toLowerCase();
        }

        await user.save()

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
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