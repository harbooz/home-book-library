import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      navigate('/');
    } catch (err) {
      setError(err.message || 'Unexpected error');
    }
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: 'calc(100vh - 60px)',
          background: 'linear-gradient(to bottom right, #6a11cb, #2575fc)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Segoe UI, sans-serif',
          padding: 20,
          boxSizing: 'border-box'
        }}
      >
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

            <button type="submit" style={submitStyle}>
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
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
      </div>
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
