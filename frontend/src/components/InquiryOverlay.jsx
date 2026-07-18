import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useInquiry } from '../context/InquiryContext';

const InquiryOverlay = ({ isOpen, onClose, t, lang }) => {
  const { inquiryItems, removeFromInquiry, updateQuantity, clearInquiry, totalCount } = useInquiry();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inquiryItems.length === 0) return;
    
    setStatus('Sending Inquiry...');

    const payload = {
      ...formData,
      items: inquiryItems.map(item => ({
        productName: item.name,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        let message = `*Bulk Inquiry from Saumya Sales Website*\n\n`;
        message += `*Customer:* ${formData.name}\n`;
        message += `*Business:* ${formData.businessName}\n`;
        message += `*Phone:* ${formData.phone}\n\n`;
        message += `*Requested Products:*\n`;
        inquiryItems.forEach((item, index) => {
          const itemName = lang === 'hi' && item.nameHi ? item.nameHi : item.name;
          message += `${index + 1}. ${itemName} - Qty: ${item.quantity}\n`;
        });
        if (formData.message) message += `\n*Note:* ${formData.message}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/917489470244?text=${encodedMessage}`;

        setStatus('Success! Opening WhatsApp...');
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          clearInquiry();
          onClose();
        }, 1500);
      } else {
        setStatus('Failed to send. Please try again.');
      }
    } catch (error) {
      setStatus('Server Error. Please try again later.');
    }
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="side-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>{t.cartTitle}</h2>
          <button className="close-drawer" onClick={onClose}>&times;</button>
        </div>

        <div className="drawer-content">
          {inquiryItems.length === 0 ? (
            <div className="empty-state">
              <span className="icon">🛒</span>
              <h3>{t.cartEmpty}</h3>
              <p>{t.cartEmptyDesc}</p>
              <button className="btn btn-secondary" style={{ marginTop: '2rem' }} onClick={() => {
                onClose();
                const catalog = document.getElementById('catalog');
                if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
              }}>{t.cartBrowse}</button>
            </div>
          ) : (
            <>
              <div className="inquiry-items-section">
                {inquiryItems.map(item => (
                  <div key={item.id} className="inquiry-card">
                    <div className="item-thumb">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <span>🥣</span>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{lang === 'hi' && item.nameHi ? item.nameHi : item.name}</h4>
                      <p>{item.category}</p>
                      <button className="remove-item" onClick={() => removeFromInquiry(item.id)}>Remove Item</button>
                    </div>
                    <div className="qty-pill">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="business-details-section" style={{ marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Business Verification</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Contact Person Name</label>
                    <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Business / Shop Name</label>
                    <input type="text" name="businessName" placeholder="Enter your business name" value={formData.businessName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number (WhatsApp preferred)</label>
                    <input type="tel" name="phone" placeholder="+91 XXXX XXX XXX" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="business@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea name="message" placeholder="Any specific requirements or questions?" value={formData.message} onChange={handleChange} rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-warm)', fontFamily: 'var(--font-sans)' }}></textarea>
                  </div>
                  
                  {status && (
                    <div style={{ 
                      background: status.includes('Success') ? '#f0fdf4' : '#fef2f2', 
                      color: status.includes('Success') ? '#16a34a' : '#ef4444', 
                      padding: '1rem', 
                      borderRadius: '8px', 
                      marginBottom: '1.5rem', 
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      border: status.includes('Success') ? '1px solid #dcfce7' : '1px solid #fee2e2'
                    }}>
                      {status}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '50px' }}>
                    Send Inquiry via Email & WhatsApp
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        {inquiryItems.length > 0 && (
          <div className="drawer-footer">
             <div className="inquiry-summary">
               <span>Total Items:</span>
               <span>{totalCount}</span>
             </div>
             <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
               Our team will review your inquiry and contact you with wholesale pricing within 24 hours.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryOverlay;
