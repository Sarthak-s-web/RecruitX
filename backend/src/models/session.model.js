const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    refreshTokenHash:{
        type:String,
        require:true
    },
    expiresAt:{
        type:Date,
        require: true
    }
}, {timestamps:true} );

const Session = mongoose.model("Session", sessionSchema)

module.exports = Session