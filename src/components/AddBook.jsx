import React, { useEffect, useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import Tesseract from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // adjust your import path
import Header from './Header';

export default function AddBook() {
  const [photo, setPhoto] = useState(null); // base64 data URL
  const [isProcessing, setIsProcessing] = useState(false);
  const [book, setBook] = useState({
    title: '',
    authors: '',
    thumbnail: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('books').select('*').limit(1);
      if (error) {
        console.error('Select error:', error);
      } else {
        console.log('Select data:', data);
      }
    };

    testConnection()
  })

  const takePhotoAndExtractTitle = async () => {
    try {
      setIsProcessing(true);
      setBook({ title: '', authors: '', thumbnail: '' });
      // Take photo
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        quality: 90,
        allowEditing: false,
      });
      setPhoto(image.dataUrl);

      // OCR extract text
      const ocrResult = await Tesseract.recognize(image.dataUrl, 'eng', {
        logger: m => console.log('OCR', m.status, m.progress),
      });
      const extractedText = ocrResult.data.text.trim();
      if (!extractedText) {
        alert('No text detected in the photo.');
        setIsProcessing(false);
        return;
      }

      // Set extracted text as title (user can edit it)
      setBook(book => ({
        ...book,
        title: extractedText,
        thumbnail: image.dataUrl,
      }));
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

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
  
      const authorsArray = book.authors
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);
  
      const { data, error } = await supabase
        .from('books')
        .insert([
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
  };

  return (
    <>
      <Header />
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
        <h2>Add a New Book</h2>

        <button onClick={takePhotoAndExtractTitle} disabled={isProcessing} style={{ marginBottom: 10 }}>
          📷 Take Cover Photo & Detect Title
        </button>

        {photo && (
          <div style={{ marginBottom: 10 }}>
            <img
              src={photo}
              alt="Book cover"
              style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 0 10px #aaa' }}
            />
          </div>
        )}

        {isProcessing && <p>Processing...</p>}

        {photo && (
          <div style={{ marginTop: 10, padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
            <label>
              Title:{' '}
              <input
                type="text"
                value={book.title}
                onChange={e => setBook({ ...book, title: e.target.value })}
                style={{ width: '100%', marginBottom: 8 }}
              />
            </label>
            <label>
              Authors (comma separated):{' '}
              <input
                type="text"
                value={book.authors}
                onChange={e => setBook({ ...book, authors: e.target.value })}
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
        )}
      </div>
    </>
  );
}
