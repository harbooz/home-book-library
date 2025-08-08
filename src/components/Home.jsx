import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import Header from './Header';
import { BsPencilSquare, BsTrash, BsFloppy, BsXLg, BsPlusLg } from 'react-icons/bs';
import Theme from '../Theme';
import { useNavigate } from 'react-router-dom'; 
import DeleteConfirmModal from './DeleteConfirmModal';

const HomePageContainer = styled.div`
    position: relative;
    display: flex;
    min-height: 100%;
    flex-direction: column;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("/assets/web-cover-home-page.jpg") no-repeat center center;
    background-size: cover;
    z-index: -1;
  }
`

const ContainerWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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

    .add--books {
      margin-top: 20px;
      height: 50px;
      padding: 0;
      font-size: 18px;
      text-transform: uppercase;
      max-width: 300px;
      width: 100%;
    }
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
`

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    justify-content: center;
    max-width: 120rem;
    gap: 2rem;
     @media (min-width: 380px) and (max-width: 767px) {
      gap: 1rem;
    }
`

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
       max-width: 16rem;
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
    margin: 0 auto;
    border-radius: 5px;
    border: solid 1px gray;
    padding: 5px;
    box-sizing: border-box;
    margin-bottom: 5px;
}

    .book__title {
      font-size: 1.6rem;
      line-height: 1.8rem;
      font-weight: 600;
      text-align: center;
       @media (min-width: 380px) and (max-width: 767px) {
          font-size: 1.4rem;
        } 
    }

    .book__author {
      font-size: 1.4rem;
      color: rgb(127, 140, 141);
      margin: 0px 0px 1.4rem;
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
`
const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
  height: 4rem;
  font-size: 1.6rem;
  max-width: 37rem;
  width: 100%;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  &:focus {
  border: unset;
  outline: none;
  }
`;

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editedBook, setEditedBook] = useState({ title: '', authors: '', thumbnail: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [bookToDelete, setBookToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setBooks([]);
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBooks(data || []);
    } catch (error) {
      alert('Failed to load books: ' + (error.message || 'Check console for details'));
    } finally {
      setLoading(false);
    }
  }

  const startEditing = (book) => {
    setEditingBookId(book.id);
    setEditedBook({ ...book });
  };

  const cancelEditing = () => {
    setEditingBookId(null);
    setEditedBook({ title: '', authors: '', thumbnail: '' });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedBook((prev) => ({
        ...prev,
        thumbnail: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = async () => {
    const { error } = await supabase
      .from('books')
      .update({
        title: editedBook.title,
        authors: editedBook.authors,
        thumbnail: editedBook.thumbnail,
      })
      .eq('id', editingBookId);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      setEditingBookId(null);
      setEditedBook({ title: '', authors: '', thumbnail: '' });
      fetchBooks();
    }
  };

  // Delete flow
  const openDeleteModal = (book) => {
    setBookToDelete(book);
  };

  const cancelDelete = () => {
    setBookToDelete(null);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      const { error } = await supabase.from('books').delete().eq('id', bookToDelete.id);
      if (error) throw error;

      setBooks((prev) => prev.filter(book => book.id !== bookToDelete.id));
    } catch (error) {
      alert('Delete failed: ' + error.message);
    } finally {
      setBookToDelete(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const q = searchQuery.toLowerCase();
    return book.title.toLowerCase().includes(q) || book.authors.toLowerCase().includes(q);
  });

  return (
    <HomePageContainer className='home-container'>
      <Header />
      <ContainerWrapper className='container'>
        <h1 className='main__title'>My Home Book Library</h1>

        {books.length > 0 && (
          <SearchInput
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search books"
          />
        )}

        {loading ? (
          <div className='spinner__wrapper'>
          <div className="spinner" aria-label="Loading spinner" role="status" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <p className='sub__title'>
           {user && "No books found matching your search."}
            {books.length === 0 && (
              <>
                No books yet! <br />Let’s start building your personal library
              </>
            )}
            <button
              className='add--books'
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  navigate('/add');
                } else {
                  navigate('/login');
                }
              }}
            >
              Add Books
            </button>
          </p>
        ) : (
          <CardContainer>
            {filteredBooks.map(book => {
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
                            className='add-cover-btn'
                            htmlFor={`coverUpload-${book.id}`}
                            title="Add cover"
                          >
                            <BsPlusLg size={18} />
                            Add Cover
                          </label>
                        </>
                      )}
                      {editedBook.thumbnail && (
                        <div className='bookCover'>
                          <img
                            src={editedBook.thumbnail}
                            alt="Cover"
                          />
                        </div>
                      )}
                      <input
                       className='edit-input'
                        type="text"
                        value={editedBook.title}
                        onChange={e => setEditedBook(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Book Title"
                        aria-label="Edit book title"
                      />
                      <input
                        type="text"
                        value={editedBook.authors}
                        onChange={e => setEditedBook(prev => ({ ...prev, authors: e.target.value }))}
                        placeholder="Author(s)"
                        aria-label="Edit book authors"
                        className='edit-input'
                      />
                      <div>
                        <button className='icon__btn' onClick={saveEdit} aria-label="Save edit">
                          <BsFloppy />
                        </button>
                        <button className='icon__btn' onClick={cancelEditing} aria-label="Cancel edit">
                          <BsXLg />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {book.thumbnail && (
                        <div className='bookCover'>
                          <img src={book.thumbnail} alt={`Cover of ${book.title}`} />
                        </div>
                      )}
                      <h2 className='book__title'>{book.title}</h2>
                      <p className='book__author'>{book.authors}</p>
                      <div>
                        <button className='icon__btn' onClick={() => startEditing(book)} aria-label={`Edit ${book.title}`}>
                          <BsPencilSquare />
                        </button>
                        <button
                          className='icon__btn'
                          onClick={() => openDeleteModal(book)}
                          aria-label={`Delete ${book.title}`}
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </>
                  )}
                </CardWrapper>
              );
            })}
          </CardContainer>
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
