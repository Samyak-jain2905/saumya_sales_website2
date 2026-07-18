import React from 'react';

export const LanguageSwitcher = ({ currentLang, onSwitch }) => (
  <div className="lang-segment-control">
    <button 
      onClick={() => onSwitch('en')} 
      className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
    >
      EN
    </button>
    <button 
      onClick={() => onSwitch('hi')} 
      className={`lang-btn ${currentLang === 'hi' ? 'active' : ''}`}
    >
      HI
    </button>
  </div>
);

export const FestivalBanner = () => (
  <div style={{ 
    background: 'var(--text-dark)', 
    color: 'var(--primary)', 
    fontWeight: 'bold', 
    padding: '0.4rem 0',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 2000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '0.8rem'
  }}>
    <style>
      {`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}
    </style>
    <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite', minWidth: '100%' }}>
      ← Festive Sale → ← Special Discount → ← Limited Offer → ← Premium Wholesale → ← Festive Sale → ← Special Discount →
    </div>
  </div>
);

export const MobileBottomNav = ({ setOverlayOpen, setCallBackOpen }) => (
  <div className="mobile-bottom-nav">
    <style>
      {`
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid var(--glass-border);
            z-index: 1500;
            box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
          }
          .mobile-bottom-nav button, .mobile-bottom-nav a {
            flex: 1;
            padding: 1rem 0;
            text-align: center;
            background: transparent;
            border: none;
            border-right: 1px solid var(--glass-border);
            color: var(--text-dark);
            font-size: 0.8rem;
            font-weight: 700;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
            text-decoration: none;
          }
          .mobile-bottom-nav button:last-child {
            border-right: none;
          }
          .mobile-bottom-nav span {
            font-size: 1.2rem;
          }
        }
      `}
    </style>
    <a href="https://wa.me/917489470244">
      <span>💬</span> WhatsApp
    </a>
    <button onClick={() => setCallBackOpen(true)}>
      <span>📞</span> Call
    </button>
    <button onClick={() => setOverlayOpen(true)} style={{ color: 'var(--primary)' }}>
      <span>📋</span> Inquiry
    </button>
  </div>
);
