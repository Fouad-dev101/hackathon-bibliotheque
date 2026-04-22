import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('token');

  const fetchBorrows = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/borrows/me', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBorrows(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const returnBook = async (borrowId) => {
    try {
      await axios.put(`http://localhost:5000/api/borrows/return/${borrowId}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchBorrows();
    } catch (err) {
      alert('Erreur lors du retour');
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const styles = {
    container: { padding: '20px' },
    title: { fontSize: '28px', color: '#2c3e50', marginBottom: '30px' },
    empty: { textAlign: 'center', fontSize: '18px', color: '#7f8c8d', padding: '50px' },
    grid: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
    card: { border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', width: '320px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    bookTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' },
    bookAuthor: { color: '#7f8c8d', marginBottom: '15px' },
    date: { fontSize: '14px', color: '#95a5a6', marginBottom: '10px' },
    status: { padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' },
    statusEnCours: { background: '#fef9e7', color: '#f39c12' },
    statusTermine: { background: '#d5f5e3', color: '#27ae60' },
    returnButton: { background: '#e67e22', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '16px' },
    loading: { textAlign: 'center', fontSize: '18px', color: '#7f8c8d', padding: '50px' }
  };

  if (loading) return <div style={styles.loading}>📖 Chargement de vos emprunts...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📖 Mes emprunts</h1>
      {borrows.length === 0 ? (
        <div style={styles.empty}>
          <p>📚 Vous n'avez aucun emprunt pour le moment.</p>
          <p>Allez dans la <strong>Bibliothèque</strong> pour emprunter des livres !</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {borrows.map(borrow => (
            <div key={borrow.id} style={styles.card}>
              <h3 style={styles.bookTitle}>{borrow.titre}</h3>
              <p style={styles.bookAuthor}>✍️ {borrow.auteur}</p>
              <p style={styles.date}>📅 Emprunté le : {borrow.date_emprunt}</p>
              <span style={{ ...styles.status, ...(borrow.statut === 'en cours' ? styles.statusEnCours : styles.statusTermine) }}>
                {borrow.statut === 'en cours' ? '🟡 En cours' : '✅ Terminé'}
              </span>
              {borrow.statut === 'en cours' && (
                <button onClick={() => returnBook(borrow.id)} style={styles.returnButton}>
                  🔄 Rendre ce livre
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBorrows;