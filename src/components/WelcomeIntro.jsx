import React, { useContext } from 'react';
import styled from 'styled-components';
import Theme from '../Theme';
import { useNavigate } from 'react-router-dom';
import { BooksContext } from '../contexts/BooksContext';
import bgImage from '/assets/web-cover-home-page.jpg';

const WelcomeWrapper = styled.div.attrs({ className: 'welcome-wrapper' })`
  position: relative;
  display: flex;
  height: calc(100% - 6rem);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
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

  h1 {
    font-weight: 700;
    font-size: 4.2rem;
    margin: 4rem auto;
    text-align: center;
    color: ${Theme.colors.whiteText};
  }

  h2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2.5rem;
    color: ${Theme.colors.whiteText};
    text-align: center;
    margin-top: 2rem;
  }

  .cta__wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .add--books {
    margin-top: 2rem;
    height: 5rem;
    padding: 0;
    font-size: 1.8rem;
    text-transform: uppercase;
    max-width: 30rem;
    width: 100%;
  }

  .check__list {
    font-size: 16px;
    color: ${Theme.colors.whiteText};
    background: ${Theme.colors.primary};
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
  }
`;

export default function WelcomeIntro() {
  const { user } = useContext(BooksContext);
  const navigate = useNavigate();

  return (
    <WelcomeWrapper>
      <h1>My Home Book Library</h1>

      {user ? (
        <>
          <h2>Keep adding books to your library</h2>
          <h3 className="check__list" onClick={() => navigate('/books-list')}>
            Check your books list
          </h3>
        </>
      ) : (
        <h2>
          No books yet! <br />
          Let’s start building your personal library
        </h2>
      )}

      <div className="cta__wrapper">
        <button
          className="add--books"
          onClick={() => {
            if (user) {
              navigate('/add');
            } else {
              navigate('/login');
            }
          }}
        >
          Add Books
        </button>
      </div>
    </WelcomeWrapper>
  );
}
