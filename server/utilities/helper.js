const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dzmk8y1dq", //own config
    api_key: "911279293627331",
    api_secret: "zL0Md4MHeBH0BimhN_L5vAhXDUI",
    secure: true,
    cdn_subdomain: true,
});



const uploadImg = async (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto" 
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(fileBuffer);
    });
};

module.exports = {uploadImg}