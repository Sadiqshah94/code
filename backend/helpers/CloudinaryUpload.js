import multer from 'multer';
import dotenv from 'dotenv';


dotenv.config();







import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret:process.env.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      console.log("File MIME type:", file.mimetype); // Log MIME type for debugging
      let folder = "uploads";
      if (file.mimetype === "application/pdf") {
        folder = "uploads/pdf";
      } else {
        folder = "uploads/images";
      }
  
      return {
        folder,
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      };
    },
    allowedFormats: ['jpg', 'png', 'jpeg', 'pdf'],
  });
  


const uploads = multer({ storage });

export default uploads;











