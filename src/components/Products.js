import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Products({ onLogout, userRole }) {
  const canManageProducts = userRole === 'admin' || userRole === 'editor';
  const canDeleteProducts = userRole === 'admin';
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
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Products</h1>
          <p className="dashboard-subtitle">
            {canManageProducts ? 'Manage your products in one place.' : 'Browse the product inventory.'}
          </p>
        </div>
        <button className="button button-secondary" onClick={onLogout}>Sign out</button>
      </header>

      {error && <p className="alert" role="alert">{error}</p>}

      <div className="dashboard-content">
        {canManageProducts && (
          <section className="panel" aria-labelledby="product-form-title">
          <div className="panel-heading">
            <div>
              <h2 id="product-form-title">{form.id ? 'Edit product' : 'Add a product'}</h2>
              <p>{form.id ? 'Update the details below.' : 'Enter the details to add it to your inventory.'}</p>
            </div>
          </div>
          <form className="product-form form-panel" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="product-name">Product name</label>
          <input
            id="product-name"
            type="text"
            placeholder="Product Name"
            value={form.product_name}
            onChange={(e) => setForm({ ...form, product_name: e.target.value })}
            required
          />
            </div>
            <div className="field">
              <label htmlFor="product-description">Description</label>
          <input
            id="product-description"
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
            </div>
            <div className="field">
              <label htmlFor="product-price">Price</label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
            </div>
            <div className="field">
              <label htmlFor="product-quantity">Quantity</label>
          <input
            id="product-quantity"
            type="number"
            min="0"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
            </div>
            <div className="form-actions">
              <button className="button button-primary" type="submit">
                {form.id ? 'Save changes' : 'Add product'}
              </button>
              {form.id && (
                <button className="button button-secondary" type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          </section>
        )}

        <section className="panel" aria-labelledby="product-list-title">
          <div className="panel-heading">
            <div>
              <h2 id="product-list-title">All products</h2>
              <p>{canManageProducts ? 'Your current inventory.' : 'Products available in the inventory.'}</p>
            </div>
            <span className="product-count">{products.length} items</span>
          </div>
          <div className="table-scroll">
            <table className="product-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Product</th>
                  <th scope="col">Description</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  {canManageProducts && <th scope="col">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
            <tr>
                    <td className="empty-state" colSpan={canManageProducts ? 6 : 5}>
                      {canManageProducts ? 'No products yet. Add your first product above.' : 'No products found.'}
                    </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                      <td className="product-name">{p.product_name}</td>
                      <td className="product-description">{p.description || '—'}</td>
                      <td>{Number(p.price).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                <td>{p.quantity}</td>
                {canManageProducts && <td>
                        <div className="table-actions">
                          {canManageProducts && (
                            <button className="button button-secondary" onClick={() => handleEdit(p)}>Edit</button>
                          )}
                          {canDeleteProducts && (
                            <button className="button button-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                          )}
                        </div>
                </td>}
              </tr>
            ))
          )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}