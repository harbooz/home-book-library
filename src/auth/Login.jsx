import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BooksContext } from '../contexts/BooksContext';
import { useContext } from 'react';
import bgImage from '/assets/web-cover-home-page.jpg';

const LoginContainer = styled.div.attrs({className: "login-container"})`

    min-height: calc(100vh - 6rem);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    box-sizing: border-box;

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
  }
`


export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { fetchBooks, loading } = useContext(BooksContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const { error } = isLogin
        ? await login(email, password)
        : await signup(email, password);
      if (error) throw error;

      await fetchBooks();

      navigate('/books-list');
    } catch (err) {
      setError(err.message || 'Unexpected error');
    }
  }

  return (
    <>
      <LoginContainer>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: '32px 28px',
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 24,
              color: '#2575fc',
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>

          {error && (
            <p style={{ color: 'red', fontSize: 14, marginBottom: 16 }}>{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              ref={emailRef}
              required
              style={inputStyle}
              placeholder="you@example.com"
            />

            <label style={labelStyle}>Password</label>
            <input
              type="password"
              ref={passwordRef}
              required
              style={inputStyle}
              placeholder="••••••••"
            />  
          {loading ? ( <button type="submit" style={submitStyle}>
              {isLogin ? 'loading' : 'Sign Up'}
            </button>) : ( <button type="submit" style={submitStyle}>
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>)}
           
          </form>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={linkButtonStyle}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </LoginContainer>
    </>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: 8,
  fontWeight: 500,
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  marginBottom: 20,
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 14,
  outlineColor: '#2575fc',
  boxSizing:' border-box'
};

const submitStyle = {
  width: '100%',
  backgroundColor: '#2575fc',
  color: 'white',
  padding: '12px 0',
  borderRadius: 8,
  border: 'none',
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#2575fc',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontWeight: 'bold',
};
