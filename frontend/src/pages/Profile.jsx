import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({ nom: '', prenom: '', email: '' });
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
      if (form.password) updateData.password = form.password;
      
      await axios.put('http://localhost:5000/api/profile', updateData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.nom = form.nom;
      user.prenom = form.prenom;
      localStorage.setItem('user', JSON.stringify(user));
      
      setProfile({ ...profile, nom: form.nom, prenom: form.prenom });
      setEditMode(false);
      setMessage('Profil mis à jour !');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const containerStyle = { maxWidth: '500px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' };
  const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' };
  const buttonStyle = { padding: '10px 20px', margin: '10px 5px', border: 'none', borderRadius: '5px', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <h1>👤 Mon profil</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      {!editMode ? (
        <div>
          <p><strong>Nom:</strong> {profile.nom}</p>
          <p><strong>Prénom:</strong> {profile.prenom}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button onClick={() => setEditMode(true)} style={{ ...buttonStyle, background: '#3498db', color: 'white' }}>✏️ Modifier</button>
        </div>
      ) : (
        <form onSubmit={updateProfile}>
          <input type="text" placeholder="Nom" style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
          <input type="text" placeholder="Prénom" style={inputStyle} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
          <input type="password" placeholder="Nouveau mot de passe (optionnel)" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" style={{ ...buttonStyle, background: '#2ecc71', color: 'white' }}>💾 Enregistrer</button>
          <button type="button" onClick={() => setEditMode(false)} style={{ ...buttonStyle, background: '#95a5a6', color: 'white' }}>Annuler</button>
        </form>
      )}
    </div>
  );
}

export default Profile;