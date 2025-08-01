import { Preferences } from '@capacitor/preferences';

export async function getBooks() {
  const res = await Preferences.get({ key: 'books' });
  return res.value ? JSON.parse(res.value) : [];
}

export async function saveBook(book) {
  const books = await getBooks();
  books.push(book);
  await Preferences.set({ key: 'books', value: JSON.stringify(books) });
}
