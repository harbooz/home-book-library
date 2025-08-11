import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './components/Home'
import AddBook from './components/AddBook'
import { AuthProvider } from './contexts/AuthContext';
import Login from './auth/Login'
import { BooksProvider } from './contexts/BooksContext';
import WelcomeIntro from './components/WelcomeIntro'
import Header from './components/Header'



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
<BooksProvider>
  <AuthProvider>
   <BrowserRouter>
   <Header/>
    <Routes>
      <Route path="/" element={<WelcomeIntro/>}/>
      <Route path="/books-list" element={<Home/>}/>
      <Route path="add" element={<AddBook />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  </BrowserRouter>
  </AuthProvider>
  </BooksProvider>
  </React.StrictMode>,
)
