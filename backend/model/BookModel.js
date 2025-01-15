import mongoose from "mongoose";


const BookSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    pdf: {
        type: String,
    },
    price: {
        type: Number,
    },
    thumbnailPublicId: { type: String },
    pdfPublicId: { type: String },
})


const Book = mongoose.model("Book", BookSchema);

export default Book;
