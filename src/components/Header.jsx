import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRightToBracket, FaArrowRightFromBracket, FaPlus } from "react-icons/fa6";
import styled from 'styled-components';
import Theme from '../Theme';
import { useAuth } from '../contexts/AuthContext';

const HeaderNav = styled.div`
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: ${Theme.colors.darkBrown};
    color:  ${Theme.colors.whiteText};
    height: 6rem;
    box-sizing: border-box;

  .btn__login, .btn__add-book {
    display: flex;
    align-items: center;
    text-decoration: unset;
    color: ${Theme.colors.whiteText};
    gap: 6px;
    font-size: 1.4rem;

    & svg {
      font-size: 1.6rem;
    }

    & span {
      display: inline;
    }

    @media (max-width: 600px) {
      & span {
        display: none;
      }
    }
  }

  .btn__add-book {
    background-color: white;
    color: #182848;
    padding: 8px 12px;
    border-radius: 5px;
    font-weight: bold;

    @media (max-width: 600px) {
      padding: 8px;
      justify-content: center;
    }
  }
`;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <HeaderNav className='header-nav'>
    
        <Link to="/" style={{ color: 'white', fontSize: '2rem', textDecoration: 'none' }}>
          📚 Home Library
        </Link>

        <nav style={{ display: 'flex', gap: 12 }}>
          {location.pathname === '/' && user && (
            <Link to="/add" className="btn__add-book">
              <FaPlus /> <span>Add Book</span>
            </Link>
          )}

          {!user ? (
            <Link className="btn__login" to="/login">
              <span>Log In</span> <FaArrowRightToBracket />
            </Link>
          ) : (
            <button
              className="btn__login"
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Log Out</span> <FaArrowRightFromBracket />
            </button>
          )}
        </nav>
    </HeaderNav>
  );
}
