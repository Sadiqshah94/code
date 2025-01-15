import express from "express";
import Book from "../model/BookModel.js";
import Stripe from "stripe";
import uploads from "../helpers/CloudinaryUpload.js";
import dotenv from "dotenv";

dotenv.config();

// multer,multer-cloud-storage, cloudinary
// https://www.npmjs.com/package/multer-storage-cloudinary

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const stripe = Stripe(process.env.STRIPE_SECRET_KEY);



const BookRoutes = express.Router();

BookRoutes.get("/", async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.status(200).send({ message: "All Books", allBooks });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// BookRoutes.post('/add',uploads.single('thumbnail'), async(req,res)=>{
//     const {title,author} = req.body;
//     const thumbnail = req.file.path;
//     try{
//         if(!title || !author){
//             return res.status(400).send({message: "Title and Author are required"});
//         }
//         const newBook = {
//             title,
//             author,
//             thumbnail
//         }
//         await Book.create(newBook)
//         res.status(201).send({message: "book added successfully",newBook})
//     }
//     catch(error){
//         res.status(500).send({message: error.message});
//     }

// })
BookRoutes.post(
  "/add",
  uploads.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, author } = req.body;
    const thumbnail = req.files?.thumbnail?.[0]?.path;
    const pdf = req.files?.pdf?.[0]?.path;
    try {
      if (!title || !author) {
        return res
          .status(400)
          .send({ message: "Title and Author are required" });
      }
      const newBook = {
        title,
        author,
        thumbnail,
        pdf,
        thumbnailPublicId: req.files?.thumbnail?.[0]?.filename,
        pdfPublicId: req.files?.pdf?.[0]?.filename,
        price: 20000,
      };
      await Book.create(newBook);
      res.status(201).send({ message: "book added successfully", newBook });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

BookRoutes.delete("/delete-all", async (req, res) => {
  try {
    await Book.deleteMany({});
    res.status(200).send({ message: "All Books deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

BookRoutes.delete("/delete/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    if (book.thumbnailPublicId) {
      await cloudinary.uploader.destroy(book.thumbnailPublicId);
    }

    if (book.pdfPublicId) {
      await cloudinary.uploader.destroy(book.pdfPublicId);
    }
    await Book.findByIdAndDelete(bookId);

    res
      .status(200)
      .send({ message: "Book and associated files deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting book", error: error.message });
  }
});

BookRoutes.put(
  "/update/:id",
  uploads.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    const bookId = req.params.id;
    const { title, author } = req.body;
    const newThumbnail = req.files?.thumbnail?.[0]?.path;
    const newPdf = req.files?.pdf?.[0]?.path;
    const newThumbnailPublicId = req.files?.thumbnail?.[0]?.filename;
    const newPdfPublicId = req.files?.pdf?.[0]?.filename;

    try {
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }

      if (newThumbnail && book.thumbnailPublicId) {
        await cloudinary.uploader.destroy(book.thumbnailPublicId);
      }

      if (newPdf && book.pdfPublicId) {
        await cloudinary.uploader.destroy(book.pdfPublicId);
      }

      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
          title: title || book.title,
          author: author || book.author,
          thumbnail: newThumbnail || book.thumbnail,
          pdf: newPdf || book.pdf,
          thumbnailPublicId: newThumbnailPublicId || book.thumbnailPublicId,
          pdfPublicId: newPdfPublicId || book.pdfPublicId,
        },
        { new: true }
      );

      res
        .status(200)
        .send({ message: "Book updated successfully", updatedBook });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error updating book", error: error.message });
    }
  }
);

BookRoutes.post('/checkout',async(req,res)=>{
  const {bookId} = req.body;
  console.log(bookId)
  try{
    const book = await Book.findById(bookId);
    if(!book){
      return res.status(404).send({message: "Book not found"})
    }
    const totalPrice = book.price;
    console.log(totalPrice)


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title,
              description: book.author,
            },
            unit_amount: book.price, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: `http://localhost:5173/cancel`,
    });

    // Send the session URL to the frontend
    res.send({ checkoutUrl: session.url });
  }
  catch(error){
    res.status(500).send({message: error.message})
  }
  

})


export default BookRoutes;
