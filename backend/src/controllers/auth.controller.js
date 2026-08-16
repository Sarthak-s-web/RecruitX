const bcrypt= require("bcryptjs")
const crypto = require("crypto")
const User = require("../models/user.model")
const Session = require("../models/session.model")

const {generateAccessToken, generateRefreshToken} = require("../utils/generateToken")

const registerUser = async(req,res)=>{
    try {

        //1. Get data from request
        const{name, email ,password} = req.body;

        //2. Validate user
        if(!name || !email || !password){
            return res.status(400).json({
                message:"Name, email, password is required"
            })
        }

        //3.Check if user already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            })
        }

        //4. hash password 
        const passwordHash = await bcrypt.hash(password, 10)

        //5.create user
        const user = await User.create({
            name,
            email,
            passwordHash
        })

        //6.create session
        const session = await Session.create({
            userId: user._id,
            refreshTokenHash: "temporary",
            expiresAt: new Date(Date.now()+ 7*24*60*60*1000)
        })

        //7.Generate Tokens
        const accessToken= generateAccessToken(user)
        const refreshToken = generateRefreshToken(user, session._id);

        //8.Hash refresh token
        const refreshTokenHash = 
        crypto.createHash("sha256")
        .update(refreshToken)
        .digest("hex")

        //9.update session with real hashed refreshtoken 
        session.refreshTokenHash = refreshTokenHash;

        await session.save();

        return res.status(201).json({
            message:"User registered successfully",
            user:{
                userId:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            },
            accessToken,
            refreshToken
        }
    )
        
    } catch (error) {
        console.log("Registraion error", error.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

module.exports = {
    registerUser
}