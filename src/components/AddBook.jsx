import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ISBNScanner from './ISBNScanner';
import Header from './Header';


const AddBookWrapper = styled.div`
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
display: block
}

.add-book-section {
     margin-top: 10px;
    padding: 12px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 8px;
    background: #e3e3e3;
}

`

export default function AddBook() {
  const [photo, setPhoto] = useState(null);
  const [book, setBook] = useState({ title: '', authors: '', thumbnail: '' });
  const [warningMessage, setWarningMessage] = useState('');
  const [error, setError] = useState('');
  const [manualIsbn, setManualIsbn] = useState('');
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const previousBookRef = useRef({ title: '', authors: '' });

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('books').select('*').limit(1);
      if (error) console.error('Select error:', error);
      else console.log('Select data:', data);
    };
    testConnection();
  }, []);

  // Resize and compress image to max width 400
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

  // Handle file upload for cover photo
  const handleFileChange = async (event) => {
    setWarningMessage('');
    setError('');
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
        setError('Failed to process the image.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle book detected from barcode scanner
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
  };

  // Fetch book info by manual ISBN input
  const fetchBookByISBN = async () => {
    if (!manualIsbn.trim()) {
      setError('Please enter a valid ISBN.');
      return;
    }
    setFetching(true);
    setError('');
    setWarningMessage('');
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
        setError('');
      } else {
        setError('No book found for this ISBN.');
      }
    } catch (err) {
      console.error('ISBN lookup failed:', err);
      setError('Failed to fetch book data.');
    } finally {
      setFetching(false);
    }
  };

  // Save book to Supabase
  const saveBook = async () => {
    if (!book.title.trim()) {
      alert('Please enter a book title.');
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

      const { data, error } = await supabase.from('books').insert([
        {
          title: book.title,
          authors: book.authors,
          thumbnail: book.thumbnail,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error('Supabase insert error:', error);
        alert('Failed to save book: ' + JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return;
      }

      alert(`Added "${book.title}" to your library!`);
      navigate('/');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error: ' + error.message);
    }
  };

  const cancelAdd = () => {
    setPhoto(null);
    setBook({ title: '', authors: '', thumbnail: '' });
    setWarningMessage('');
    setError('');
    setManualIsbn('');
  };

  return (
    <AddBookWrapper>
      <Header />
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
        <h2>Add a New Book</h2>

        {/* ISBN Scanner */}
        <ISBNScanner onBookDetected={onBookDetected} />

        {/* Manual ISBN Input */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <label>
            Manual ISBN Input:{' '}
            <input
              type="text"
              value={manualIsbn}
              onChange={(e) => setManualIsbn(e.target.value)}
              placeholder="Enter ISBN manually"
              style={{ width: '60%', marginRight: 8 }}
            />
          </label>
          <button onClick={fetchBookByISBN} disabled={fetching}>
            {fetching ? 'Fetching...' : 'Find Book'}
          </button>
        </div>

        {/* Upload cover photo */}
        <label
          htmlFor="fileInput"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: 5,
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          📁 Upload Cover Photo
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {warningMessage && <p style={{ color: 'orange', fontWeight: 'bold' }}>{warningMessage}</p>}

        {photo && (
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <img
              src={photo}
              alt="Book cover preview"
              style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 0 10px #aaa' }}
            />
          </div>
        )}

        {/* Book info inputs */}
        <div className='add-book-section'>
          <label>
            Title:
            <input
              type="text"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
              style={{ width: '100%', marginBottom: 8 }}
            />
          </label>
          <label>
            Authors (comma separated):{' '}
            <input
              type="text"
              value={book.authors}
              onChange={(e) => setBook({ ...book, authors: e.target.value })}
              style={{ width: '100%', marginBottom: 8 }}
            />
          </label>

          <button onClick={saveBook} style={{ marginRight: 10 }}>
            ➕ Add to Library
          </button>
          <button onClick={cancelAdd} style={{ backgroundColor: '#ccc' }}>
            Cancel
          </button>
        </div>
      </div>
    </AddBookWrapper>
  );
}
