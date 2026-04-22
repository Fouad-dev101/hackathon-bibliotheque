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

  const containerStyle = { display: 'flex', gap: '20px', flexWrap: 'wrap' };
  const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', width: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
  const buttonStyle = { padding: '8px 12px', marginTop: '10px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>📖 Mes emprunts</h1>
      {borrows.length === 0 ? (
        <p>Vous n'avez aucun emprunt.</p>
      ) : (
        <div style={containerStyle}>
          {borrows.map(borrow => (
            <div key={borrow.id} style={cardStyle}>
              <h3>{borrow.titre}</h3>
              <p>Auteur: {borrow.auteur}</p>
              <p>📅 Emprunté le: {borrow.date_emprunt}</p>
              <p>Statut: <strong style={{ color: borrow.statut === 'en cours' ? 'orange' : 'green' }}>{borrow.statut}</strong></p>
              {borrow.statut === 'en cours' && (
                <button onClick={() => returnBook(borrow.id)} style={buttonStyle}>🔄 Rendre</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBorrows;