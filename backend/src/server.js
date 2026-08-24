require("dotenv").config()
const express= require("express")
const app= require("./app")
const connectDB= require("./config/db")

const PORT = process.env.PORT || 3000

connectDB();

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})