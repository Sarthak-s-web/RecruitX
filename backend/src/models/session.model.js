const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refreshTokenHash:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required: true
    }
}, {timestamps:true} );

const Session = mongoose.model("Session", sessionSchema)

module.exports = Session