import React, { useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ISBNScanner from './ISBNScanner';
import Theme from '../Theme';
import { BsSearch, BsUpload } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import AddBookConfirmationModal from './AddBookConfirmationModal';
import { BooksContext } from '../contexts/BooksContext'; 
import bgImage from '/assets/web-cover-home-page.jpg';


const AddBookWrapper = styled.div`
  position: relative;
  overflow: hidden;
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
    background: url(${bgImage}) no-repeat center center;
    background-size: cover;
    z-index: -1;
  }

  .isbn__container {
    padding: 2rem;
    max-width: 57rem;
    margin: auto;
    background: ${Theme.colors.darkBrownRgba};
    border-radius: 1rem;
    width: 100%;
    color: ${Theme.colors.whiteText};

    h2 {
      font-size: 2rem;
      margin: 0;
    }

    svg {
      font-size: 2rem;
    }
    .isbn__add-container {
      margin-top: 2rem;
      margin-bottom: 2rem;

      .isbn-search {
         position: relative;
      }

    }
    label {
      font-size: 1.4rem;
      input {
        width: 60%;
        margin-left: 10px;
        background: transparent;
        color: ${Theme.colors.whiteText};
        border-color: ${Theme.colors.whiteText};
      }
    }
    & ::placeholder {
      color: ${Theme.colors.whiteText};
    }
  }

  .find--book {
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    position: absolute;
    right: 99px;
    top: 0;
    &:hover {
      border: solid 1px transparent;
    }
  }

  input {
    height: 40px;
    max-width: 340px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    border: solid 1px #ccc;
  }

  label {
    display: block;
  }

  .add-book-section {
    margin-top: 10px;
    padding: 12px;
    border: 1px solid ${Theme.colors.whiteText};
    border-radius: 8px;

    label{
      &:first-child {
         margin-bottom: 5px;
      }
    }

    .cta__wrapper {
      display: flex;
      margin: 1rem;
      button:first-child {
      margin-right: 5px;
      }
    }

    .action--btn {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      svg {
        margin-right: 5px;
      }
      &.cancel {
        background: ${Theme.colors.danger};
        color: ${Theme.colors.whiteText};
      }
      &:hover {
        border: solid 1px transparent;
      }
      &:focus {
        outline: unset;
      }
    }
  }

  .upload__cover {
    background: ${Theme.colors.primary};
    display: flex;
    padding: 1rem 2rem;
    color: ${Theme.colors.whiteText};
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 1rem;
    align-items: center;
    max-width: 20rem;
    width: 100%;
    justify-content: center;

    svg {
      margin-right: 10px;
    }
  }

  .error-message {
    color: ${Theme.colors.errorMessage};
    margin-top: 5px;
    font-weight: bold;
    font-size: 1.6rem;
  }

  .warning-message {
    color: orange;
    font-weight: bold;
  }
`;

export default function AddBook() {
  const { setBooks } = useContext(BooksContext);

  const [photo, setPhoto] = useState(null);
  const [book, setBook] = useState({ title: '', authors: '', thumbnail: '' });
  const [warningMessage, setWarningMessage] = useState('');
  const [saveWarning, setSaveWarning] = useState('');
  const [isbnError, setIsbnError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [manualIsbn, setManualIsbn] = useState('');
  const [fetching, setFetching] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const navigate = useNavigate();
  const previousBookRef = useRef({ title: '', authors: '' });

  async function resizeAndCompressImage(dataUrl, maxWidth = 400, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = maxWidth / img.width;
        const width = Math.min(img.width, maxWidth);
        const height = img.height * scale;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = dataUrl;
    });
  }

  const handleFileChange = async (event) => {
    setWarningMessage('');
    setSaveWarning('');
    setIsbnError('');
    setTitleError('');
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressed = await resizeAndCompressImage(reader.result);
        setPhoto(compressed);
        setBook((prevBook) => ({ ...prevBook, thumbnail: compressed }));
      } catch (error) {
        console.error('Error compressing image:', error);
        setTitleError('Failed to process the image.');
      }
    };
    reader.readAsDataURL(file);
  };

  const onBookDetected = (detectedBook) => {
    if (
      previousBookRef.current.title === detectedBook.title &&
      previousBookRef.current.authors === detectedBook.authors
    ) {
      setWarningMessage(
        'Scanned book info is the same as previous. Please try scanning a different book or adjust the camera.'
      );
      return;
    }
    setBook(detectedBook);
    setPhoto(detectedBook.thumbnail || null);
    previousBookRef.current = {
      title: detectedBook.title,
      authors: detectedBook.authors,
    };
    setWarningMessage('');
    setSaveWarning('');
    setIsbnError('');
    setTitleError('');
  };

  const fetchBookByISBN = async () => {
    if (!manualIsbn.trim()) {
      setIsbnError('Please enter a valid ISBN.');
      return;
    }
    setFetching(true);
    setIsbnError('');
    setWarningMessage('');
    setSaveWarning('');
    try {
      const isbnCode = manualIsbn.replace(/[^0-9X]/gi, '').slice(-13);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnCode}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const volume = data.items[0].volumeInfo;
        const bookData = {
          title: volume.title || 'Unknown Title',
          authors: (volume.authors || []).join(', ') || 'Unknown Author',
          thumbnail: volume.imageLinks?.thumbnail || '',
        };

        if (
          previousBookRef.current.title === bookData.title &&
          previousBookRef.current.authors === bookData.authors
        ) {
          setWarningMessage(
            'Book info is the same as previous. Try a different ISBN or adjust input.'
          );
          setFetching(false);
          return;
        }

        setBook(bookData);
        setPhoto(bookData.thumbnail || null);
        previousBookRef.current = {
          title: bookData.title,
          authors: bookData.authors,
        };
        setIsbnError('');
      } else {
        setIsbnError('No book found for this ISBN.');
      }
    } catch (err) {
      console.error('ISBN lookup failed:', err);
      setIsbnError('Failed to fetch book data.');
    } finally {
      setFetching(false);
    }
  };

  const saveBook = async () => {
    if (!book.title.trim()) {
      setTitleError('Please enter a book title.');
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('Please log in to add books.');
        return;
      }

      const { data: existingBooks, error: fetchError } = await supabase
        .from('books')
        .select('id')
        .eq('title', book.title)
        .eq('authors', book.authors);

      if (fetchError) {
        console.error('Error checking duplicates:', fetchError);
        setSaveWarning('Error checking for existing books.');
        return;
      }

      if (existingBooks.length > 0) {
        setSaveWarning('This exact book by this author already exists.');
        return;
      }

      // Insert and get inserted row
      const { data: insertedBooks, error: insertError } = await supabase
        .from('books')
        .insert([
          {
            title: book.title.trim(),
            authors: book.authors.trim(),
            thumbnail: book.thumbnail,
            user_id: user.id,
          },
        ])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        alert('Failed to save book: ' + insertError.message);
        return;
      }

          if (insertedBooks && insertedBooks.length > 0) {
        setBooks((prevBooks) => [insertedBooks[0], ...prevBooks]);
        setSaveWarning('');
        navigate('/books-list');  
        return;  
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error: ' + error.message);
    }
  };

  const cancelAdd = () => {
    setPhoto(null);
    setBook({ title: '', authors: '', thumbnail: '' });
    setWarningMessage('');
    setIsbnError('');
    setTitleError('');
    setManualIsbn('');
    setSaveWarning('');
    navigate('/');
  };

  const handleModalClose = () => {
    setShowConfirmationModal(false);
    navigate('/');
  };

  return (
    <AddBookWrapper>
      <div className="isbn__container">
        <h2>Add a New Book</h2>

        <ISBNScanner onBookDetected={onBookDetected} />

        {isbnError && <p className="error-message">{isbnError}</p>}

        <div className="isbn__add-container">
          <label className='isbn-search'>
            Manual ISBN Input:
            <input
              type="tel"
              value={manualIsbn}
              onChange={(e) => setManualIsbn(e.target.value)}
              placeholder="Enter ISBN manually"
            />
            <button className="find--book" onClick={fetchBookByISBN} disabled={fetching}>
            <BsSearch /> {fetching ? 'Fetching...' : ''}
          </button>
          </label>
          
        </div>

        <label className="upload__cover" htmlFor="fileInput">
          <BsUpload /> Upload Cover Photo
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {titleError && <p className="error-message">{titleError}</p>}
        {saveWarning && <p className="error-message">{saveWarning}</p>}
        {warningMessage && <p className="warning-message">{warningMessage}</p>}

        <div className="add-book-section">
          <label>
            Title:
            <input
              type="text"
              value={book.title}
              onChange={(e) => setBook((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Book title"
            />
          </label>

          <label>
            Author(s):
            <input
              type="text"
              value={book.authors}
              onChange={(e) => setBook((prev) => ({ ...prev, authors: e.target.value }))}
              placeholder="Author names"
            />
          </label>
<div className='cta__wrapper'>
          <button className="action--btn" onClick={saveBook}>
            <FaPlus /> Add Book
          </button>

          <button className="action--btn cancel" onClick={cancelAdd}>
            Cancel
          </button>
          </div>
        </div>
      </div>    
    </AddBookWrapper>
  );
}
