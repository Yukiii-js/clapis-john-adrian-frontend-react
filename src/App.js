import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Products from './components/Products';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login setAuth={setIsAuthenticated} />
      ) : (
        <Products onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;