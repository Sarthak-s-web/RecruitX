const bcrypt= require("bcryptjs")
const crypto = require("crypto")
const User = require("../models/user.model")
const Session = require("../models/session.model")
const jwt = require("jsonwebtoken")

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
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            },
            accessToken,
            refreshToken
        })
        
    } catch (error) {
        console.log("Registraion error", error.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

const loginUser = async(req,res)=>{
    try {
        const{email,password}= req.body
    
        if(!email || !password){
            return res.status(400).json({
                message:"Email and Password is required"
            })
        }
    
        const user = await User.findOne({email}).select("+passwordHash")
        if(!user)
        {
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }
    
        const isValidPassword = await bcrypt.compare(password,user.passwordHash)
        if(!isValidPassword)
        {
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }
    
         const session = await Session.create({
                userId: user._id,
                refreshTokenHash: "temporary",
                expiresAt: new Date(Date.now()+ 7*24*60*60*1000)
            })
    
            const accessToken= generateAccessToken(user)
            const refreshToken = generateRefreshToken(user, session._id);
    
            const refreshTokenHash = 
            crypto.createHash("sha256")
            .update(refreshToken)
            .digest("hex")
    
            session.refreshTokenHash = refreshTokenHash;
    
            await session.save();
    
            return res.status(200).json({
                message:"Login successfully",
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                accessToken,
                refreshToken
            })
    } catch (error) {
        console.log("Login error",error.message);
        return res.status(500).json({
            message:"Internal Server error"
        })
           
    }

}

const refreshAccessToken = async(req,res)=>{
    try {
        const {refreshToken} = req.body
        if(!refreshToken)
        {
            return res.status(401).json({
                message:"Refresh Token is required"
            })
        }
    
        const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);
    
        const refreshTokenHash= crypto.createHash("sha256").update(refreshToken).digest("hex")

        const session = await Session.findOne({
            _id: decoded.sessionId,
            userId: decoded.userId,
            refreshTokenHash
        });

        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (session.expiresAt < new Date()) {
            return res.status(401).json({
                message: "Session expired"
            });
        }

        // 6. Find user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

         const accessToken = generateAccessToken(user);
        // 8. Send response
        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });

        
    } catch (error) {
        console.log("Refresh token error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
            
    })
}
}

const logoutUser = async(req,res)=>{
    try {

        const {refreshToken }= req.body
        
        if(!refreshToken)
        {
            return res.status(400).json({
                message:"Refresh token is required"
            })
        }

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

        const session = await Session.findOneAndDelete({
          refreshTokenHash  
        })

        if(!session)
        {
            return res.status(400).json({
                message:"Invalid refresh token"
            })
        }

        return res.status(200).json({
            message:"Logout Successful"
        })
        
    } catch (error) {
        console.log("Logout error:", error.message);

        return res.status(500).json({
        message: "Internal server error"
    })
}

}

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
}