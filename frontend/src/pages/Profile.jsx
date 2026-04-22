import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({ nom: '', prenom: '', email: '', role: '' });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', password: '' });
  const [message, setMessage] = useState('');

  const getToken = () => localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setProfile(res.data);
      setForm({ nom: res.data.nom, prenom: res.data.prenom, password: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const updateData = { nom: form.nom, prenom: form.prenom };
      if (form.password && form.password.trim() !== '') {
        updateData.password = form.password;
      }
      
      await axios.put('http://localhost:5000/api/profile', updateData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.nom = form.nom;
      user.prenom = form.prenom;
      localStorage.setItem('user', JSON.stringify(user));
      
      setProfile({ ...profile, nom: form.nom, prenom: form.prenom });
      setEditMode(false);
      setMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '30px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    title: { fontSize: '28px', color: '#2c3e50', marginBottom: '30px', textAlign: 'center' },
    info: { marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '10px' },
    label: { fontWeight: 'bold', color: '#7f8c8d', marginBottom: '5px' },
    value: { fontSize: '18px', color: '#2c3e50' },
    input: { width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' },
    buttonGroup: { display: 'flex', gap: '15px', marginTop: '20px' },
    editButton: { background: '#3498db', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', flex: 1 },
    saveButton: { background: '#2ecc71', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', flex: 1 },
    cancelButton: { background: '#95a5a6', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', flex: 1 },
    message: { background: '#d5f5e3', color: '#27ae60', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' },
    adminBadge: { background: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', marginLeft: '10px' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        👤 Mon profil
        {profile.role === 'admin' && <span style={styles.adminBadge}>Admin</span>}
      </h1>
      {message && <div style={styles.message}>{message}</div>}
      
      {!editMode ? (
        <div>
          <div style={styles.info}>
            <div style={styles.label}>Nom</div>
            <div style={styles.value}>{profile.nom}</div>
          </div>
          <div style={styles.info}>
            <div style={styles.label}>Prénom</div>
            <div style={styles.value}>{profile.prenom}</div>
          </div>
          <div style={styles.info}>
            <div style={styles.label}>Email</div>
            <div style={styles.value}>{profile.email}</div>
          </div>
          <button onClick={() => setEditMode(true)} style={styles.editButton}>
            ✏️ Modifier mon profil
          </button>
        </div>
      ) : (
        <form onSubmit={updateProfile}>
          <input
            type="text"
            placeholder="Nom"
            style={styles.input}
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            style={styles.input}
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe (optionnel)"
            style={styles.input}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton}>💾 Enregistrer</button>
            <button type="button" onClick={() => setEditMode(false)} style={styles.cancelButton}>Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;