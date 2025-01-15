import express from 'express';
import Book from '../model/BookModel.js';
import { uploads } from '../helpers/upload.js';


const bookRoutes = express.Router();


bookRoutes.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send({ message: "success", books });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

bookRoutes.post('/add', uploads.fields([
    {name:"thumbnail",maxCount:1},
    {name:"pdf",maxCount:1}
]),  async (req, res) => {
    try {
        const {title, author} = req.body;
        const thumbnail = req.files?.thumbnail?.[0]?.path;
            const pdf = req.files?.pdf?.[0]?.path; 
        if (!title || !author || !pdf || !thumbnail) {
            return res.status(400).send({ message: "Please provide all required fields" });
        }
        const newBook = await Book.create({
            title,
            author,
            thumbnail,
            pdf
        })
        res.status(200).send({ message: "Add book successfully", newBook });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


bookRoutes.delete('/delete-all',async(req,res)=>{
    try{
        const deleteAllBooks = await Book.deleteMany({});
        res.status(200).send({message: "All Books deleted successfully"});
    }catch(error){
        res.status(500).send({message: error.message});
    }
})



export default bookRoutes;
