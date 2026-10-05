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
      const token = res.data.tokens?.access_token
        || res.data.token
        || res.data.data?.token
        || res.data.access_token;

      if (token) {
        localStorage.setItem('token', token);
        setAuth(res.data.user?.role);
      } else {
        setError('Login failed. Token not received.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    }
  };


  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">P.</div>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-intro">Sign in to manage your product inventory.</p>
        {error && <p className="alert" role="alert">{error}</p>}
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          </div>
          <button className="button button-primary button-full" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}