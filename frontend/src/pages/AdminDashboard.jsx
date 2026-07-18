import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState({ products: [], enquiries: [], users: [], "shop-photos": [] });
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    nameHi: '',
    category: 'Crockery',
    imageUrl: '',
    price: '',
    wholesalePrice: '',
    moq: '',
    size: '',
    description: '',
    descriptionHi: ''
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/${activeTab}`);
      const result = await res.json();
      if (Array.isArray(result)) {
        setData(prev => ({ ...prev, [activeTab]: result }));
      } else {
        console.error('Expected array but got:', result);
        setData(prev => ({ ...prev, [activeTab]: [] }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    await fetch(`${API_BASE_URL}/api/admin/${activeTab}/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
        try {
          await fetch(`${API_BASE_URL}/api/admin/shop-photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: reader.result })
          });
          fetchData();
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setProductForm({
      name: product.name || '',
      nameHi: product.nameHi || '',
      category: product.category || 'Crockery',
      imageUrl: product.imageUrl || '',
      price: product.price || '',
      wholesalePrice: product.wholesalePrice || '',
      moq: product.moq || '',
      size: product.size || '',
      description: product.description || '',
      descriptionHi: product.descriptionHi || ''
    });
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Parse numeric price for database sorting/filtering
    const numericPrice = parseFloat(productForm.price.replace(/[^0-9.]/g, '')) || 0;
    const finalProductData = { ...productForm, priceNumeric: numericPrice };

    try {
      const url = editProductId 
        ? `${API_BASE_URL}/api/admin/products/${editProductId}`
        : `${API_BASE_URL}/api/admin/products`;
      const method = editProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProductData)
      });
      if (res.ok) {
        alert(editProductId ? 'Product Updated Successfully!' : 'Product Saved Successfully!');
        setShowProductForm(false);
        setEditProductId(null);
        setProductForm({
          name: '',
          nameHi: '',
          category: 'Crockery',
          imageUrl: '',
          price: '',
          wholesalePrice: '',
          moq: '',
          size: '',
          description: '',
          descriptionHi: ''
        });
        fetchData();
      } else {
        let errorMessage = res.statusText;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            errorMessage = errData.message || errorMessage;
          } else {
            const textData = await res.text();
            errorMessage = textData || errorMessage;
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        alert('Failed to save product: ' + errorMessage);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product. Please check connection and image size.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') return <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}><h2>Access Denied</h2></div>;

  return (
    <div className="admin-dashboard" style={{ padding: '8rem 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '3rem' }}>Admin Control Panel</h1>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {['products', 'enquiries', 'shop-photos', 'users'].map(tab => (
            <button 
              key={tab} 
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab === 'shop-photos' ? 'Manage Gallery' : `Manage ${tab}`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          {activeTab === 'products' && (
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Product Inventory</h3>
              <button 
                onClick={() => {
                  setShowProductForm(!showProductForm);
                  if (!showProductForm) {
                    setEditProductId(null);
                    setProductForm({
                      name: '', nameHi: '', category: 'Crockery', imageUrl: '', price: '', wholesalePrice: '', moq: '', size: '', description: '', descriptionHi: ''
                    });
                  }
                }} 
                className="btn btn-primary"
              >
                {showProductForm ? 'Cancel' : '+ Add New Product'}
              </button>
            </div>
          )}

          {showProductForm && activeTab === 'products' && (
            <div className="admin-form-overlay" style={{ marginBottom: '3rem', padding: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <form onSubmit={submitProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Product Name (English)</label>
                  <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Product Name (Hindi)</label>
                  <input type="text" name="nameHi" value={productForm.nameHi} onChange={handleProductChange} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={productForm.category} onChange={handleProductChange} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <option value="Crockery">Crockery</option>
                    <option value="Plastic">Plastic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Retail Price (Rate)</label>
                  <input type="text" name="price" placeholder="e.g. ₹450" value={productForm.price} onChange={handleProductChange} required />
                </div>
                <div className="form-group">
                  <label>Base Wholesale Price</label>
                  <input type="text" name="wholesalePrice" placeholder="e.g. ₹380" value={productForm.wholesalePrice} onChange={handleProductChange} required />
                </div>
                <div className="form-group">
                  <label>Minimum Order Quantity (MOQ)</label>
                  <input type="text" name="moq" placeholder="e.g. 100 Units" value={productForm.moq} onChange={handleProductChange} />
                </div>
                <div className="form-group">
                  <label>Size / Dimensions</label>
                  <input type="text" name="size" placeholder="e.g. 10 inch" value={productForm.size} onChange={handleProductChange} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Product Image (URL or Browse)</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" name="imageUrl" placeholder="Image URL" value={productForm.imageUrl} onChange={handleProductChange} style={{ flex: 1 }} />
                    <input type="file" onChange={handleFileChange} accept="image/*" style={{ width: 'auto' }} />
                  </div>
                  {productForm.imageUrl && (
                    <div style={{ marginTop: '1rem' }}>
                      <img src={productForm.imageUrl} alt="Preview" style={{ height: '80px', borderRadius: '8px' }} />
                    </div>
                  )}
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description (English)</label>
                  <textarea name="description" value={productForm.description} onChange={handleProductChange} rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}></textarea>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description (Hindi)</label>
                  <textarea name="descriptionHi" value={productForm.descriptionHi} onChange={handleProductChange} rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}></textarea>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Product</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="admin-table-container">
              {activeTab === 'products' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Category</th>
                      <th style={{ padding: '1rem' }}>Retail Price</th>
                      <th style={{ padding: '1rem' }}>Wholesale Price</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem' }}>{p.name}</td>
                        <td style={{ padding: '1rem' }}>{p.category}</td>
                        <td style={{ padding: '1rem' }}>{p.price?.startsWith('₹') ? p.price : `₹${p.price}`}</td>
                        <td style={{ padding: '1rem' }}>{p.wholesalePrice?.startsWith('₹') ? p.wholesalePrice : `₹${p.wholesalePrice}`}</td>
                        <td style={{ padding: '1rem' }}>
                          <button onClick={() => handleEditProduct(p)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>Edit</button>
                          <button onClick={() => deleteItem(p.id)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#ef4444' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'enquiries' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1rem' }}>Customer</th>
                      <th style={{ padding: '1rem' }}>Business</th>
                      <th style={{ padding: '1rem' }}>Phone</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.enquiries.map(e => (
                      <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem' }}>{e.name}</td>
                        <td style={{ padding: '1rem' }}>{e.businessName}</td>
                        <td style={{ padding: '1rem' }}>{e.phone}</td>
                        <td style={{ padding: '1rem' }}>
                          <button onClick={() => setSelectedEnquiry(e)} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>View Details</button>
                          <button onClick={() => deleteItem(e.id)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#ef4444' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'users' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Business</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>{u.businessName}</td>
                        <td style={{ padding: '1rem' }}>{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'shop-photos' && (
                <div>
                  <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Shop Gallery</h3>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="file" 
                        id="gallery-upload" 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                      />
                      <label 
                        htmlFor="gallery-upload" 
                        className="btn btn-primary" 
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                      >
                        + Upload Shop Photo
                      </label>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {data['shop-photos'].map(photo => (
                      <div key={photo.id} className="glass-card" style={{ padding: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                        <img src={photo.imageUrl} alt="Shop" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px' }} />
                        <button 
                          onClick={() => deleteItem(photo.id)} 
                          style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    {data['shop-photos'].length === 0 && (
                      <p style={{ gridColumn: 'span 3', textAlign: 'center', opacity: 0.5, padding: '3rem' }}>No photos uploaded yet. Use the button above to add some!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(45, 36, 36, 0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '600px', padding: '3.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto', background: 'white', borderRadius: '24px', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setSelectedEnquiry(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--bg-warm)', border: 'none', color: 'var(--text-dark)', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
            
            <h2 style={{ marginBottom: '2.5rem', color: 'var(--text-dark)', fontSize: '2.2rem' }}>Enquiry <span style={{ color: 'var(--primary)' }}>Details</span></h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Customer Name</p>
                <p style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>{selectedEnquiry.name}</p>
              </div>
              <div>
                <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Business Name</p>
                <p style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>{selectedEnquiry.businessName || 'N/A'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Phone Number</p>
                <p style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>{selectedEnquiry.phone}</p>
              </div>
              <div>
                <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Email Address</p>
                <p style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>{selectedEnquiry.email || 'N/A'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Date Received</p>
              <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
            </div>

            <div style={{ marginBottom: '2.5rem', padding: '2rem', background: 'var(--bg-warm)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ marginBottom: '1.2rem', color: 'var(--text-dark)', fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>Interested Products</h4>
              {selectedEnquiry.items && selectedEnquiry.items.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedEnquiry.items.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: idx !== selectedEnquiry.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                      <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{item.productName}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Qty: {item.quantity || 1}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontStyle: 'italic', opacity: 0.6 }}>No specific items mentioned.</p>
              )}
            </div>

            <div>
              <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Customer Message</p>
              <p style={{ lineHeight: 1.8, padding: '2rem', background: 'var(--bg-warm)', borderRadius: '20px', border: '1px solid var(--glass-border)', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                "{selectedEnquiry.message || 'No message provided.'}"
              </p>
            </div>
            
            <button onClick={() => setSelectedEnquiry(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '3rem' }}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
