import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import BookRoutes from './routes/BookRoutes.js';


dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());



const db =async ()=>{
   try{
    await mongoose.connect(
        process.env.MONGODB_URI)
        console.log('Database connected');
   }
   catch(error){
    console.log(error);
   }
}


db();
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to my API!' });
});

app.use('/api/books',BookRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`); 
})
