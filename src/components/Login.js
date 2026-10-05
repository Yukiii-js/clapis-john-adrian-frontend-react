import React, { useState } from 'react';
import API from '../api';

export default function Login({ setAuth }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/login', credentials);
      

      console.log('Login API Response:', res.data);


      const token = res.data.tokens?.access_token
        || res.data.token
        || res.data.data?.token
        || res.data.access_token;

      if (token) {
        localStorage.setItem('token', token);
        setAuth(true);
      } else {
        setError('Login failed. Token not received.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    }
  };


  return (
    <div style={{ maxWidth: '360px', margin: '80px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Username</label>
          <input
            type="text"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>Password</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}