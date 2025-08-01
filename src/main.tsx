import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Home from './components/Home'
import AddBook from './components/AddBook'
import { AuthProvider } from './contexts/AuthContext';
import Login from './auth/Login'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <AuthProvider>
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="add" element={<AddBook />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  </BrowserRouter>
  </AuthProvider>
  </React.StrictMode>,
)
