import React from 'react'
import BookForm from './component/Form'
import BooksListing from './component/BooksListing'
import BookList from './component/BooksListing'
import { Route, Routes } from 'react-router-dom'
import Reject from './component/Reject'
import SuccessPage from './component/Sucess'

const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<BooksListing />} />
        <Route exact path="/add-book" element={<BookForm />} />
        <Route exact path="/success" element={<SuccessPage />} />
        <Route exact path="/reject" element={<Reject />} />
      </Routes>
    </div>
  )
}

export default App