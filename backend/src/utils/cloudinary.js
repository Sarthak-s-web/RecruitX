const {v2: cloudinary } = require("cloudinary")

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadResume = (buffer)=>{
    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream({
            folder:"recruitx/resume",
            resource_type:"image"
        },
        (error,result)=>{
            if(error){
                reject(error)
            }
            else{
                resolve(result);
            }
        }
    );

    stream.end(buffer);
    });
};


module.exports = {
    cloudinary,
    uploadResume
}