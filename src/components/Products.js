import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Products({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: null, product_name: '', description: '', price: '', quantity: '' });

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data.data || res.data);
    } catch (err) {
      setError('Failed to fetch products. Make sure you are logged in.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await API.put(`/products/${form.id}`, form);
      } else {
        await API.post('/products', form);
      }
      setForm({ id: null, product_name: '', description: '', price: '', quantity: '' });
      fetchProducts();
    } catch (err) {
      alert('Operation failed.');
    }
  };

  const handleEdit = (product) => {
    setForm(product);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  const handleCancelEdit = () => {
    setForm({ id: null, product_name: '', description: '', price: '', quantity: '' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Product Management</h2>
        <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '16px', borderRadius: '6px', marginBottom: '24px' }}>
        <h3>{form.id ? 'Edit Product' : 'Add New Product'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input
            type="text"
            placeholder="Product Name"
            value={form.product_name}
            onChange={(e) => setForm({ ...form, product_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
        </div>
        <div style={{ marginTop: '12px' }}>
          <button type="submit" style={{ padding: '8px 16px', marginRight: '8px', cursor: 'pointer' }}>
            {form.id ? 'Update Product' : 'Save Product'}
          </button>
          {form.id && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List Table */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No products found.</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.product_name}</td>
                <td>{p.description}</td>
                <td>${parseFloat(p.price).toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: '6px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}