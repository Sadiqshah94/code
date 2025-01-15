import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BookList =() => {
  const [books,setBooks] = useState([]);
  const getAllBooks = async()=>{
      const response = await axios.get('http://localhost:8000/api/books')
      setBooks(response.data?.allBooks);
  }
  console.log(books);

  useEffect(()=>{
    getAllBooks();
  },[])


  const deleteFile =async (id)=>{
    try{
      await axios.delete(`http://localhost:8000/api/books/delete/${id}`);
      getAllBooks();
    }
    catch(error){
      console.error(error);
    }
  }

  const handlePayment = async (bookId) => {
    try {
      const response = await axios.post('http://localhost:8000/api/books/checkout', { bookId });
      console.log(response);
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session", error);
    }
  };

    
  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {books?.map((book, index) => (
          <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h3>{book.title}</h3>
            <img src={book.thumbnail}/>
            <p><strong>Author:</strong> {book.author}</p>
            {book.pdf && (
              <div>
                {book?.price ? 
                <div>
                <button onClick={() => handlePayment(book._id)}>Pay Now: ${book.price / 100}</button>
              </div>
                :  
                <>
                <strong>Download PDF:</strong>
                <a  download href={book.pdf} target="_blank" rel="noopener noreferrer">Download PDF</a></>
              }
              </div>
            )}
            {book.thumbnail && (
              <p>
                <strong>Thumbnail:</strong> <img src={book.thumbnail} alt={book.title} width="100" />
              </p>
            )}
            <button onClick={()=>deleteFile(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
