import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BooksList() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ titre: '', auteur: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false);
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

  const styles = {
    container: { padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', color: '#2c3e50' },
    addButton: { background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
    formContainer: { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' },
    input: { padding: '10px', margin: '10px', width: '250px', border: '1px solid #ddd', borderRadius: '5px' },
    submitButton: { background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
    cancelButton: { background: '#95a5a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' },
    booksGrid: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
    card: { border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', width: '280px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' },
    cardHover: { transform: 'translateY(-5px)' },
    bookTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' },
    bookAuthor: { color: '#7f8c8d', marginBottom: '15px' },
    status: { padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' },
    statusDispo: { background: '#d5f5e3', color: '#27ae60' },
    statusEmprunte: { background: '#fadbd8', color: '#e74c3c' },
    buttonGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
    borrowButton: { background: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', flex: 1 },
    deleteButton: { background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', flex: 1 },
    loading: { textAlign: 'center', fontSize: '18px', color: '#7f8c8d', padding: '50px' }
  };

  if (loading) return <div style={styles.loading}>📚 Chargement des livres...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Bibliothèque</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? '✖ Fermer' : '+ Ajouter un livre'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h3>Ajouter un nouveau livre</h3>
          <form onSubmit={addBook}>
            <input
              type="text"
              placeholder="Titre du livre"
              style={styles.input}
              value={newBook.titre}
              onChange={(e) => setNewBook({ ...newBook, titre: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nom de l'auteur"
              style={styles.input}
              value={newBook.auteur}
              onChange={(e) => setNewBook({ ...newBook, auteur: e.target.value })}
              required
            />
            <div>
              <button type="submit" style={styles.submitButton}>✅ Ajouter</button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.booksGrid}>
        {books.map(book => (
          <div
            key={book._id}
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={styles.bookTitle}>{book.titre}</h3>
            <p style={styles.bookAuthor}>✍️ {book.auteur}</p>
            <span style={{ ...styles.status, ...(book.etat === 'dispo' ? styles.statusDispo : styles.statusEmprunte) }}>
              {book.etat === 'dispo' ? '✅ Disponible' : '❌ Emprunté'}
            </span>
            <div style={styles.buttonGroup}>
              {book.etat === 'dispo' && (
                <button onClick={() => borrowBook(book._id)} style={styles.borrowButton}>
                  📖 Emprunter
                </button>
              )}
              <button onClick={() => deleteBook(book._id)} style={styles.deleteButton}>
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksList;