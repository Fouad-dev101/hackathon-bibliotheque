import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BooksList() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ titre: '', auteur: '' });
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/books', newBook, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setNewBook({ titre: '', auteur: '' });
      fetchBooks();
    } catch (err) {
      alert('Erreur lors de l\'ajout');
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm('Supprimer ce livre ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchBooks();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const borrowBook = async (bookId) => {
    try {
      await axios.post('http://localhost:5000/api/borrows', { book_id: bookId }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const containerStyle = { display: 'flex', gap: '30px', flexWrap: 'wrap' };
  const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', width: '250px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
  const buttonStyle = { padding: '8px 12px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' };
  const formStyle = { marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' };
  const inputStyle = { padding: '8px', margin: '5px', width: '200px' };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>📚 Bibliothèque</h1>
      
      <div style={formStyle}>
        <h3>Ajouter un livre</h3>
        <form onSubmit={addBook}>
          <input type="text" placeholder="Titre" style={inputStyle} value={newBook.titre} onChange={(e) => setNewBook({ ...newBook, titre: e.target.value })} required />
          <input type="text" placeholder="Auteur" style={inputStyle} value={newBook.auteur} onChange={(e) => setNewBook({ ...newBook, auteur: e.target.value })} required />
          <button type="submit" style={{ ...buttonStyle, background: '#2ecc71', color: 'white' }}>➕ Ajouter</button>
        </form>
      </div>

      <div style={containerStyle}>
        {books.map(book => (
          <div key={book._id} style={cardStyle}>
            <h3>{book.titre}</h3>
            <p>Auteur: {book.auteur}</p>
            <p style={{ color: book.etat === 'dispo' ? 'green' : 'red' }}>
              {book.etat === 'dispo' ? '✅ Disponible' : '❌ Emprunté'}
            </p>
            {book.etat === 'dispo' && (
              <button onClick={() => borrowBook(book._id)} style={{ ...buttonStyle, background: '#3498db', color: 'white' }}>📖 Emprunter</button>
            )}
            <button onClick={() => deleteBook(book._id)} style={{ ...buttonStyle, background: '#e74c3c', color: 'white' }}>🗑️ Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksList;