import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from './Header';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('No user found:', userError);
        setBooks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBooks(data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
      alert('Failed to load books: ' + (error.message || 'Check console for details'));
    } finally {
      setLoading(false);
    }
  }

  async function deleteBook(id) {
    const confirm = window.confirm('Are you sure you want to delete this book?');
    if (!confirm) return;

    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;

      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  }

  return (
    <>
      <Header />

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontWeight: 700, fontSize: '2.4rem', color: '#2c3e50', marginBottom: 20 }}>
          My Book Library
        </h1>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p
            style={{
              fontSize: '1.2rem',
              color: '#7f8c8d',
              textAlign: 'center',
              marginTop: 80,
            }}
          >
            Your library is empty. Start by adding some books!
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 24,
            }}
          >
            {books.map(book => (
              <div
                key={book.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    style={{
                      width: 140,
                      height: 210,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginBottom: 14,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 140,
                      height: 210,
                      backgroundColor: '#ecf0f1',
                      borderRadius: 8,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#bdc3c7',
                      fontSize: '1rem',
                      marginBottom: 14,
                    }}
                  >
                    No Cover
                  </div>
                )}

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, textAlign: 'center' }}>
                  {book.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#7f8c8d',
                    margin: '0 0 14px 0',
                    textAlign: 'center',
                  }}
                >
                  {book.authors}
                </p>

                <button
                  onClick={() => deleteBook(book.id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 3px 8px rgba(231, 76, 60, 0.4)',
                    transition: 'background-color 0.3s',
                    alignSelf: 'stretch',
                    textAlign: 'center',
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
