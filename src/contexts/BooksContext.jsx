import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

export const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editedBook, setEditedBook] = useState({ title: '', authors: '', thumbnail: '' });
  const [bookToDelete, setBookToDelete] = useState(null);

  // To track previous user ID and avoid redundant fetches
  const prevUserId = useRef(null);

  async function fetchBooks() {
    setLoading(true);
    try {
      if (!user) {
        setBooks([]);
        setFilteredBooks([]);
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
      setFilteredBooks(data || []);
    } catch (error) {
      alert('Failed to load books: ' + (error.message || 'Check console for details'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial fetch user once on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      prevUserId.current = user?.id || null;
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUserId = session?.user?.id || null;
      // Only update user state if user changed
      if (currentUserId !== prevUserId.current) {
        setUser(session?.user || null);
        prevUserId.current = currentUserId;
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch books only when user changes
  useEffect(() => {
    if (user) {
      fetchBooks();
    } else {
      setBooks([]);
      setFilteredBooks([]);
    }
  }, [user]);

  const startEditing = (book) => {
    setEditingBookId(book.id);
    setEditedBook({ ...book });
  };

  const cancelEditing = () => {
    setEditingBookId(null);
    setEditedBook({ title: '', authors: '', thumbnail: '' });
  };

  const clearBooks = () => {
    setBooks([]);
    setFilteredBooks([]);
    localStorage.removeItem('booksCache');
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
    if (!editingBookId) return;
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

      setBooks((prev) => prev.filter((book) => book.id !== bookToDelete.id));
      setFilteredBooks((prev) => prev.filter((book) => book.id !== bookToDelete.id));
    } catch (error) {
      alert('Delete failed: ' + error.message);
    } finally {
      setBookToDelete(null);
    }
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        filteredBooks,
        loading,
        user,
        editingBookId,
        editedBook,
        setEditedBook,
        startEditing,
        cancelEditing,
        saveEdit,
        handleCoverChange,
        bookToDelete,
        openDeleteModal,
        cancelDelete,
        confirmDeleteBook,
        fetchBooks,
        setBooks,
        setFilteredBooks,
        clearBooks,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}
