import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import Theme from '../Theme';
import { BsUpcScan } from "react-icons/bs";

const ISBNWrapper = styled.div.attrs({className: "isbn-wrapper"})`
margin-bottom: 2rem;

h3 {
  display: flex;
  align-items: center;
  svg {
    margin-right: 5px;
   }
}

.isbn__scan-box {
    border: 1px solid ${Theme.colors.mutedText};
    width: 30rem;
    height: 17rem;
    box-sizing: border-box;
    border-radius: 8px;
}

.isbn__code {
   font-size: 1.4rem;
}

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
      <h3><BsUpcScan/> Scan ISBN Barcode</h3>
      <div className='isbn__scan-box'>
        <BarcodeScannerComponent
          onUpdate={handleScan}
        />
      </div>
      {isbn && <p className='isbn__code'><strong>ISBN:</strong> {isbn}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </ISBNWrapper>
  );
}
