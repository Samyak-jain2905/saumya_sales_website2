import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, t, lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('wholesale'); // 'wholesale' or 'customer'
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    businessName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopPhoto, setShopPhoto] = useState(null);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/shop-photos`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setShopPhoto(data[0].imageUrl);
        }
      })
      .catch(err => console.error('Error fetching shop photo for auth:', err));
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.success) onClose();
      else setError(res.error);
    } else {
      const res = await signup(formData);
      if (res.success) {
        setIsLogin(true);
        setError('Account created! Please login.');
      } else setError(res.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="overlay-backdrop">
      <div className="auth-container">
        {/* Left Side: Brand & Visuals */}
        <div className="auth-sidebar" style={{ 
          background: shopPhoto 
            ? `linear-gradient(rgba(45, 36, 36, 0.4), rgba(45, 36, 36, 0.7)), url("${shopPhoto}")` 
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="brand">Saumya Sales</div>
          <div className="quote">
            "Elevating retail standards through <span style={{ color: 'var(--primary)' }}>exquisite</span> craftsmanship."
          </div>
          <div style={{ opacity: 0.7, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Trusted by 500+ Retailers Worldwide
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-wrapper">
          <button className="close-auth" onClick={onClose}>&times;</button>
          
          <div className="auth-header">
            <div className="role-selector" style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: 'var(--bg-warm)', padding: '0.4rem', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
              <button 
                type="button"
                onClick={() => setRole('wholesale')}
                style={{ flex: 1, padding: '0.8rem', border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', transition: 'all 0.3s ease', background: role === 'wholesale' ? 'var(--text-dark)' : 'transparent', color: role === 'wholesale' ? 'white' : 'var(--text-muted)' }}
              >
                {t.authWholesale}
              </button>
              <button 
                type="button"
                onClick={() => setRole('customer')}
                style={{ flex: 1, padding: '0.8rem', border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', transition: 'all 0.3s ease', background: role === 'customer' ? 'var(--text-dark)' : 'transparent', color: role === 'customer' ? 'white' : 'var(--text-muted)' }}
              >
                {t.authCustomer}
              </button>
            </div>

            <h2>{isLogin ? (role === 'wholesale' ? t.authBusinessLogin : t.authCustomerLogin) : t.authCreateAccount}</h2>
            <p>
              {isLogin 
                ? (role === 'wholesale' ? t.authAccessWholesale : t.authSignInPersonal) 
                : (role === 'wholesale' ? t.authJoinNetwork : t.authJoinCommunity)}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>{t.authFullName}</label>
                  <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
                </div>
                {role === 'wholesale' && (
                  <div className="form-group">
                    <label>Business Name</label>
                    <input type="text" name="businessName" placeholder="Your Boutique / Shop Name" onChange={handleChange} required />
                  </div>
                )}
                <div className="form-group">
                  <label>{t.authPhoneNumber}</label>
                  <input type="tel" name="phone" placeholder="+91 XXXX XXX XXX" onChange={handleChange} required />
                </div>
              </>
            )}
            <div className="form-group">
              <label>{t.authEmail}</label>
              <input type="email" name="email" placeholder="retailer@business.com" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t.authPassword}</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer' }}>{t.authForgotPassword}</span>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '12px' }} disabled={loading}>
              {loading ? t.authAuthenticating : (isLogin ? t.authSignInButton : (role === 'wholesale' ? t.authRegisterBusiness : t.authRegisterCustomer))}
            </button>
            
            {error && (
              <div style={{ 
                background: '#fef2f2', 
                color: '#ef4444', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginTop: '1rem', 
                fontSize: '0.9rem',
                border: '1px solid #fee2e2'
              }}>
                {error}
              </div>
            )}
          </form>

          <div className="auth-footer">
            <span onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ cursor: 'pointer' }}>
              {isLogin ? t.authNoAccount : t.authHasAccount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
