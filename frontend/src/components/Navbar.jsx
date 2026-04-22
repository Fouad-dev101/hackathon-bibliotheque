import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navStyle = {
    background: '#2c3e50',
    padding: '15px 20px',
    color: 'white',
    display: 'flex',
    gap: '25px',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px'
  };

  const buttonStyle = {
    marginLeft: 'auto',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <nav style={navStyle}>
      <Link to="/books" style={linkStyle}>📚 Livres</Link>
      {token && (
        <>
          <Link to="/my-borrows" style={linkStyle}>📖 Mes emprunts</Link>
          <Link to="/profile" style={linkStyle}>👤 {user.prenom || 'Profil'}</Link>
          <button onClick={handleLogout} style={buttonStyle}>Déconnexion</button>
        </>
      )}
      {!token && (
        <>
          <Link to="/login" style={{ ...linkStyle, marginLeft: 'auto' }}>Connexion</Link>
          <Link to="/signup" style={linkStyle}>Inscription</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;