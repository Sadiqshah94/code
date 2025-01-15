import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';


const BookForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('pdf', data.pdf[0]);
    formData.append('thumbnail', data.thumbnail[0]);

    try{
      const response = await axios.post('http://localhost:8000/api/books/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
    }
    catch(error){
      console.error(error);
    }


  };

  

  return (
    <div>
      <h1>Book Upload Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        
        <div>
          <label>Author</label>
          <input
            type="text"
            {...register('author', { required: 'Author is required' })}
          />
          {errors.author && <p>{errors.author.message}</p>}
        </div>

        <div>
          <label>PDF</label>
          <input
            type="file"
            accept=".pdf"
            {...register('pdf', { required: 'PDF file is required' })}
          />
          {errors.pdf && <p>{errors.pdf.message}</p>}
        </div>

        <div>
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            {...register('thumbnail', { required: 'Thumbnail is required' })}
          />
          {errors.thumbnail && <p>{errors.thumbnail.message}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BookForm;
