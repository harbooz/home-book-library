import axios from 'axios';

export async function searchBooks(query) {
  const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
    params: { q: query },
  });
  return res.data.items?.map(item => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || [],
    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
  })) || [];
}
