import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { BsPencilSquare, BsTrash, BsFloppy, BsXLg, BsPlusLg, BsXCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Theme from '../Theme';
import DeleteConfirmModal from './DeleteConfirmModal';
import { BooksContext } from '../contexts/BooksContext';
import WelcomeIntro from './WelcomeIntro';

const HomePageContainer = styled.div`
   display: flex;
   height: 100%;
`;

const ContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  flex-grow: 1;

  svg {
    font-size: 2rem;       
  }
   
  .main__title {
    font-weight: 700;
    font-size: 4.2rem;
    color: ${Theme.colors.whiteText};
    margin: 4rem auto;
    text-align: center;
  }

  .sub__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2.5rem;
    color: ${Theme.colors.whiteText};
    text-align: center;
    margin-top: 2rem;  
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .spinner__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: ${Theme.colors.whiteText || 'blue'};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 3rem auto;   
  }

  .load-more-btn {
    margin: 2rem auto 4rem;
    padding: 1.5rem 3rem;
    font-size: 1.6rem;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    background-color: ${Theme.colors.whiteText};
    color: #000;
    transition: background-color 0.3s ease;

    &:hover {
      outline: unset;
    }
    &:active {
      outline: unset;
    }
  }

  .search__container {
    position: relative;
    width: 90%;
    max-width: 37rem;
    margin-bottom: 2rem;

    .clear--btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: ${Theme.colors.text};
      font-size: 1.5rem;
      padding: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  justify-content: center;
  max-width: 120rem;
  width: 100%;
  gap: 2rem;
  @media (min-width: 380px) and (max-width: 767px) {
    gap: 1rem;
  }
`;

const CardWrapper = styled.div`
  background-color: rgb(255, 255, 255);
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 15px;
  padding: 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 25rem;
  width: 100%;

  @media (min-width: 380px) and (max-width: 767px) {
    max-width: 18rem;
    padding: 1rem;
  }

  .bookCover {
    width: 100%;
    img {
      object-fit: cover;
      object-position: top;
      width: 100%;
      height: 23rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      @media (min-width: 380px) and (max-width: 767px) {
        height: 15rem;
      } 
    }
  }

  .edit-input {
    width: 100%;
    height: 30px;
    max-width: 22rem;
    margin: 0 auto 5px;
    border-radius: 5px;
    border: solid 1px gray;
    padding: 5px;
    box-sizing: border-box;
  }

  .book__title {
    font-size: 1.6rem;
    line-height: 1.8rem;
    color: ${Theme.colors.text};
    font-weight: 600;
    text-align: center;
    @media (min-width: 380px) and (max-width: 767px) {
      font-size: 1.4rem;
    } 
  }

  .book__author {
    font-size: 1.4rem;
    color: rgb(127, 140, 141);
    margin: 0 0 1.4rem;
    text-align: center;
    @media (min-width: 380px) and (max-width: 767px) {
      font-size: 1.3rem;
    } 
  }

  .icon__btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
    color: rgb(44, 62, 80);
    padding: 0.6em 0.5em;

    &:focus {
      outline: unset;
    }
  }

  .add-cover-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1.6rem;
    padding: 6px 1.2rem;
    color: rgb(0, 0, 0);
    cursor: pointer;
    user-select: none;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
  height: 4rem;
  font-size: 1.6rem;
  width: 100%;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  &:focus {
    border: unset;
    outline: none;
  }
`;

export default function Home() {
  const {
    books,
    loading,
    user,
    editingBookId,
    editedBook,
    setEditedBook,
    startEditing,
    cancelEditing,
    saveEdit,
    handleCoverChange,
    openDeleteModal,
    bookToDelete,
    cancelDelete,
    confirmDeleteBook,
  } = useContext(BooksContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setVisibleCount(12);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredBooks = books.filter(book => {
    const q = debouncedQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(q) ||
      book.authors.toLowerCase().includes(q)
    );
  });

  const visibleBooks = filteredBooks.slice(0, visibleCount);
  const loadMore = () => setVisibleCount(prev => prev + 8);

  return (
    <HomePageContainer className="home-container">
      <ContainerWrapper className="container">
        {books.length > 0 && <h1 className="main__title">My Home Book Library</h1>}

        {books.length > 0 && (
          <div className='search__container'>
            <SearchInput
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search books"
              style={{ paddingRight: '2.5rem' }}
            />
            {searchQuery && (
              <button
                className='clear--btn'
                onClick={() => setSearchQuery('')}
                aria-label="Clear search">
                <BsXCircleFill />
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="spinner__wrapper">
            <div className="spinner" aria-label="Loading spinner" role="status" />
          </div>
        ) : books.length === 0 ? (
          <WelcomeIntro />
        ) : filteredBooks.length === 0 ? (
          <p className="sub__title">No books found matching your search.</p>
        ) : (
          <>
            <CardContainer>
              {visibleBooks.map(book => {
                const isEditing = editingBookId === book.id;
                return (
                  <CardWrapper key={book.id}>
                    {isEditing ? (
                      <>
                        {!editedBook.thumbnail && (
                          <>
                            <input
                              id={`coverUpload-${book.id}`}
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={handleCoverChange}
                            />
                            <label
                              className="add-cover-btn"
                              htmlFor={`coverUpload-${book.id}`}
                              title="Add cover"
                            >
                              <BsPlusLg size={18} />
                              Add Cover
                            </label>
                          </>
                        )}
                        {editedBook.thumbnail && (
                          <div className="bookCover">
                            <img src={editedBook.thumbnail} alt="Cover" />
                          </div>
                        )}

                        <input
                          className="edit-input"
                          name="title"
                          type="text"
                          placeholder="Edit title"
                          value={editedBook.title}
                          onChange={e =>
                            setEditedBook(prev => ({ ...prev, title: e.target.value }))
                          }
                        />

                        <input
                          className="edit-input"
                          name="authors"
                          type="text"
                          placeholder="Edit author"
                          value={editedBook.authors}
                          onChange={e =>
                            setEditedBook(prev => ({ ...prev, authors: e.target.value }))
                          }
                        />

                        <div>
                          <button
                            className="icon__btn"
                            aria-label="Save edit"
                            onClick={() => saveEdit(book.id)}
                            title="Save"
                          >
                            <BsFloppy size={24} />
                          </button>

                          <button
                            className="icon__btn"
                            aria-label="Cancel edit"
                            onClick={cancelEditing}
                            title="Cancel"
                          >
                            <BsXLg size={22} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="bookCover"
                          onClick={() => navigate(`/book-details/${book.id}`)}
                          role="button"
                          tabIndex={0}
                          aria-label={`View details for ${book.title}`}
                          onKeyDown={e => e.key === 'Enter' && navigate(`/book-details/${book.id}`)}
                        >
                          {book.thumbnail && (
                            <img
                              src={book.thumbnail}
                              alt={`Cover of ${book.title}`}
                            />
                          )}
                        </div>
                        <h2 className="book__title">{book.title}</h2>
                        <p className="book__author">{book.authors}</p>

                        <div>
                          <button
                            className="icon__btn"
                            aria-label="Edit book"
                            onClick={() => startEditing(book)}
                            title="Edit"
                          >
                            <BsPencilSquare size={22} />
                          </button>

                          <button
                            className="icon__btn"
                            aria-label="Delete book"
                            onClick={() => openDeleteModal(book)}
                            title="Delete"
                          >
                            <BsTrash size={22} />
                          </button>
                        </div>
                      </>
                    )}
                  </CardWrapper>
                );
              })}
            </CardContainer>

            {visibleCount < filteredBooks.length && (
              <div>
                <button
                  className="load-more-btn"
                  onClick={loadMore}
                  aria-label="Load more books"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {bookToDelete && (
          <DeleteConfirmModal
            bookTitle={bookToDelete.title}
            onConfirm={confirmDeleteBook}
            onCancel={cancelDelete}
          />
        )}
      </ContainerWrapper>
    </HomePageContainer>
  );
}
