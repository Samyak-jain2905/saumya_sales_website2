import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CallBackModal = ({ isOpen, onClose, t, lang }) => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(t.callSending);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, businessName: 'Callback Request', message: 'Requested a call back via website.' })
      });
      if (res.ok) {
        setStatus(t.callSuccess);
        setFormData({ name: '', phone: '' });
      } else {
        setStatus(t.callError);
      }
    } catch (err) {
      console.error(err);
      setStatus('Connection Error.');
    }
  };

  return (
    <div className="overlay-backdrop" onClick={onClose} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '350px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'white' }}>{t.requestCallback}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder={t.callNamePlaceholder} 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="tel" 
              placeholder={t.callPhonePlaceholder} 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t.callSubmit}</button>
          {status && <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#22c55e' }}>{status}</p>}
        </form>
        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', marginTop: '1rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>{t.close}</button>
      </div>
    </div>
  );
};

export default CallBackModal;
