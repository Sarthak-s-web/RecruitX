const express = require("express");
const app=express();
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const jobRoutes = require("./routes/job.route")
const applicantRoutes = require("./routes/application.route")

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth",authRoute)

app.use("/api/users",userRoutes)

app.use("/api/jobs",jobRoutes);

app.use("/api/application",applicantRoutes)

app.get("/",(req,res)=>{
    res.json({
        message:"Job portal API is running"
    })
})

module.exports=app
