import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <h2>Inscription</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" style={inputStyle} value={form.nom} onChange={handleChange} required />
        <input type="text" name="prenom" placeholder="Prénom" style={inputStyle} value={form.prenom} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" style={inputStyle} value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" style={inputStyle} value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirmer mot de passe" style={inputStyle} value={form.confirmPassword} onChange={handleChange} required />
        <button type="submit" style={buttonStyle}>S'inscrire</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}

export default Signup;