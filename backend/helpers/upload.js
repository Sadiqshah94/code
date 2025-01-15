
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import  { CloudinaryStorage }  from  'multer-storage-cloudinary';


// npm install cloudstorage-multer-cloud-storage


dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


const storage  = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: (req, file) => {
        let folder = 'uploads';
        if (file.mimetype === "application/pdf") {
            folder = "uploads/pdf";
        } else {
            folder = "uploads/images";
        }
        return { folder}; 
    },
    allowedFormats:["jpg", "png", "gif", "jpeg","pdf"],
})


export const uploads = multer({storage})

