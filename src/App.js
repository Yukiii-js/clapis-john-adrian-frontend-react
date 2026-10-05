import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Products from './components/Products';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem('role') || 'user');
    }
  }, []);

  const handleLogin = (role) => {
    const authenticatedRole = role || 'user';
    localStorage.setItem('role', authenticatedRole);
    setUserRole(authenticatedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login setAuth={handleLogin} />
      ) : (
        <Products onLogout={handleLogout} userRole={userRole} />
      )}
    </div>
  );
}

export default App;