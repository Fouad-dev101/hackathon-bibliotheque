import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    title: { fontSize: '28px', color: '#2c3e50', marginBottom: '30px', textAlign: 'center' },
    input: { width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' },
    button: { width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
    error: { background: '#fadbd8', color: '#e74c3c', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' },
    link: { textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Connexion</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={styles.button}>Se connecter</button>
      </form>
      <p style={styles.link}>
        Pas de compte ? <Link to="/signup">Créer un compte</Link>
      </p>
    </div>
  );
}

export default Login;