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

  const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    title: { fontSize: '28px', color: '#2c3e50', marginBottom: '30px', textAlign: 'center' },
    input: { width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' },
    button: { width: '100%', padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
    error: { background: '#fadbd8', color: '#e74c3c', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' },
    link: { textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inscription</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" style={styles.input} value={form.nom} onChange={handleChange} required />
        <input type="text" name="prenom" placeholder="Prénom" style={styles.input} value={form.prenom} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" style={styles.input} value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" style={styles.input} value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirmer" style={styles.input} value={form.confirmPassword} onChange={handleChange} required />
        <button type="submit" style={styles.button}>S'inscrire</button>
      </form>
      <p style={styles.link}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}

export default Signup;