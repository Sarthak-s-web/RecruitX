const express = require("express")
const app=express()
const authRoute = require("./routes/auth.route")

app.use(express.json());

app.use("/api/auth",authRoute)

app.get("/",(req,res)=>{
    res.json({
        message:"Job portal API is running"
    })
})

module.exports=app
