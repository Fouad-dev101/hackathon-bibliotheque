import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BooksList() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ titre: '', auteur: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
      alert('✅ Livre ajouté avec succès');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  const deleteBook = async (id, titre) => {
    if (!window.confirm(`Supprimer le livre "${titre}" ?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchBooks();
      alert('✅ Livre supprimé avec succès');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const borrowBook = async (bookId, titre) => {
    console.log('📖 Tentative emprunt:', bookId, titre);
    
    try {
      const response = await axios.post('http://localhost:5000/api/borrows', 
        { book_id: bookId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      console.log('✅ Réponse:', response.data);
      alert(`📖 Vous avez emprunté "${titre}" !`);
      fetchBooks();
    } catch (err) {
      console.error('❌ Erreur:', err.response?.data);
      alert(err.response?.data?.message || 'Erreur lors de l\'emprunt');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const isAdmin = user?.role === 'admin';

  const styles = {
    container: { padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
    title: { fontSize: '28px', color: '#2c3e50' },
    adminBadge: { background: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', marginLeft: '10px' },
    addButton: { background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
    formContainer: { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' },
    input: { padding: '10px', margin: '10px', width: '250px', border: '1px solid #ddd', borderRadius: '5px' },
    submitButton: { background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
    cancelButton: { background: '#95a5a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' },
    booksGrid: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
    card: { border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', width: '280px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s', background: 'white' },
    bookTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' },
    bookAuthor: { color: '#7f8c8d', marginBottom: '15px' },
    status: { padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' },
    statusDispo: { background: '#d5f5e3', color: '#27ae60' },
    statusEmprunte: { background: '#fadbd8', color: '#e74c3c' },
    buttonGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
    borrowButton: { background: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', flex: 1 },
    deleteButton: { background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', flex: 1 },
    loading: { textAlign: 'center', fontSize: '18px', color: '#7f8c8d', padding: '50px' },
    readerMessage: { color: '#7f8c8d', marginTop: '5px' }
  };

  if (loading) return <div style={styles.loading}>📚 Chargement des livres...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            📚 Bibliothèque
            {isAdmin && <span style={styles.adminBadge}>👑 ADMIN</span>}
          </h1>
          {!isAdmin && <p style={styles.readerMessage}>📖 Mode lecteur - Seuls les admins peuvent ajouter/supprimer des livres</p>}
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
            {showForm ? '✖ Fermer' : '+ Ajouter un livre'}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
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
                <button onClick={() => borrowBook(book._id, book.titre)} style={styles.borrowButton}>
                  📖 Emprunter
                </button>
              )}
              {isAdmin && (
                <button onClick={() => deleteBook(book._id, book.titre)} style={styles.deleteButton}>
                  🗑️ Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksList;