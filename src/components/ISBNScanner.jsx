import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const ISBNWrapper = styled.div`
margin-bottom: 20px


`

export default function ISBNScanner({ onBookDetected }) {
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState('');

  const fetchBookByISBN = async (isbnCode) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnCode}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const volume = data.items[0].volumeInfo;
        const bookData = {
          title: volume.title || 'Unknown Title',
          authors: (volume.authors || []).join(', ') || 'Unknown Author',
          thumbnail: volume.imageLinks?.thumbnail || '',
        };
        onBookDetected?.(bookData);
        setError('');
      } else {
        setError('No book found for this ISBN.');
      }
    } catch (err) {
      console.error('ISBN lookup failed:', err);
      setError('Failed to fetch book data.');
    }
  };

  const handleScan = (err, result) => {
    if (result?.text && result.text !== isbn) {
      const digits = result.text.replace(/[^0-9X]/gi, '').slice(-13);
      setIsbn(digits);
      fetchBookByISBN(digits);
    }
  };

  return (
    <ISBNWrapper>
      <h3>📘 Scan ISBN Barcode</h3>
      <div style={{ border: '1px solid #ccc', width: "300px", boxSizing:"border-box" }}>
        <BarcodeScannerComponent
          onUpdate={handleScan}
        />
      </div>
      {isbn && <p><strong>ISBN:</strong> {isbn}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </ISBNWrapper>
  );
}
