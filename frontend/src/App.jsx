import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BooksList from './pages/BooksList';
import MyBorrows from './pages/MyBorrows';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books" element={
            <PrivateRoute>
              <BooksList />
            </PrivateRoute>
          } />
          <Route path="/my-borrows" element={
            <PrivateRoute>
              <MyBorrows />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/books" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;