import React, { useRef, useState, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BooksContext } from '../contexts/BooksContext';
import { supabase } from '../supabaseClient';
import bgImage from '/assets/web-cover-home-page.jpg';

const LoginContainer = styled.div.attrs({ className: "login-container" })`
  height: 100%;
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

  .forgot-pass-section {
    text-align: center;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer-section {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [failedAttempt, setFailedAttempt] = useState(false); // NEW state
  const navigate = useNavigate();
  const { fetchBooks, loading } = useContext(BooksContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

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

      // If it's a login attempt, mark it as failed so we show "Forgot password?"
      if (isLogin) {
        setFailedAttempt(true);
      }
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const email = emailRef.current.value;
      if (!email) {
        setError('Please enter your email to reset password.');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    }
  }

  return (
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
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#2575fc', fontWeight: 700, fontSize: 24 }}>
          {isResetting ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {error && <p style={{ color: 'red', fontSize: 14, marginBottom: 16 }}>{error}</p>}
        {message && <p style={{ color: 'green', fontSize: 14, marginBottom: 16 }}>{message}</p>}

        <form onSubmit={isResetting ? handleResetPassword : handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            ref={emailRef}
            required
            style={inputStyle}
            placeholder="you@example.com"
            autoComplete="email"
          />

          {!isResetting && (
            <>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                ref={passwordRef}
                required
                style={inputStyle}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </>
          )}

          {loading ? (
            <button type="submit" style={submitStyle}>
              Loading...
            </button>
          ) : (
            <button type="submit" style={submitStyle}>
              {isResetting ? 'Send Reset Link' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          )}
        </form>

        {/* Show Forgot password only after a failed login */}
        {!isResetting && isLogin && failedAttempt && (
          <div className='forgot-pass-section'>
            <button
              onClick={() => setIsResetting(true)}
              style={{ ...linkButtonStyle, fontSize: 13 }}
            >
              Forgot password?
            </button>
          </div>
        )}

        <div className='footer-section'>
          {isResetting ? (
            <button onClick={() => setIsResetting(false)} style={linkButtonStyle}>
              Back to login
            </button>
          ) : (
            <>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={() => setIsLogin(!isLogin)} style={linkButtonStyle}>
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </>
          )}
        </div>
      </div>
    </LoginContainer>
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
  boxSizing: 'border-box'
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
