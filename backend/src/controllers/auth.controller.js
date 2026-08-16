const bcrypt= require("bcryptjs")
const User = require("../models.js/user.model")


const registerUser = async(req,res)=>{
    try {
        const{name, email ,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"Name, email, password is required"
            })
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            })
        }
        
        
    } catch (error) {
        
    }
}

module.exports = registerUser