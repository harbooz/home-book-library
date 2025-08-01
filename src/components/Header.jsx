import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const addBookStyle = {
    backgroundColor: 'white',
    color: '#182848', // dark text for contrast
    padding: '8px 16px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
    textAlign: 'center',
    // Responsive style: center text on small screens
    // We'll do it with a media query inside a <style> tag below
  };

  return (
    <>
     <style>
        {`
          @media (max-width: 600px) {
            .add-book-link {
              display: block;
              width: 100%;
              text-align: center !important;
            }
          }
        `}
      </style>
   
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: 'linear-gradient(90deg, #4b6cb7, #182848)',
        color: 'white',
        height: '60px',
        boxSizing: 'border-box'
      }}
    >
      <Link to="/" style={{ color: 'white', fontSize: '1.5rem', textDecoration: 'none' }}>
        📚 Home Library
      </Link>

      <nav style={{ display: 'flex', gap: 12 }}>
        {location.pathname === '/' && user && (
          <Link to="/add" className="add-book-link"
              style={addBookStyle}>
            ➕ Add Book
          </Link>
        )}

        {!user ? (
          <Link to="/login" style={{ color: 'white', textDecoration: 'underline' }}>
            🔐 Log In
          </Link>
        ) : (
          <button onClick={handleLogout} style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer' }}>
            🔓 Log Out
          </button>
        )}
      </nav>
    </header>
     </>
  );
}
