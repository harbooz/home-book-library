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
import styled from 'styled-components'
import bgImage from '/assets/web-cover-home-page.jpg';
import ForgotPassword from './auth/ForgotPassword';
import UpdatePassword from './auth/UpdatePassword';
import Profile from './auth/Profile'
import ProtectedRoute from './routes/ProtectedRoute'

const BookAppContainer = styled.div.attrs({className: "book-app-app"})`
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${bgImage}) no-repeat center center;
    background-size: cover;
    z-index: -1;
    overflow: hidden;
    background-attachment: fixed;
  }
`


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
<BooksProvider>
  <AuthProvider>
   <BrowserRouter>
   <BookAppContainer>
   <Header/>
    <Routes>
      <Route path="/" element={<WelcomeIntro/>}/>
      <Route path="/books-list" element={<Home/>}/>
      <Route path="add" element={<AddBook />} />
      <Route path="/login" element={<Login />} />     
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
       <Route path="/profile"
        element={
         <ProtectedRoute> <Profile />  </ProtectedRoute>}
        />
    </Routes>
    </BookAppContainer>
  </BrowserRouter>
  </AuthProvider>
  </BooksProvider>
  </React.StrictMode>,
)
