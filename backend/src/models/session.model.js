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

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1 });

const Session = mongoose.model("Session", sessionSchema)

module.exports = Session