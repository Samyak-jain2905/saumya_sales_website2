import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

// Magnetic Button Wrapper
const MagneticWrapper = ({ children, strength = 0.5 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * strength);
    y.set(middleY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

const PremiumNavbar = ({ lang, setLang, user, logout, isLoggedIn, totalCount, setAuthModalOpen, setOverlayOpen, setAdminView, t }) => {
  const { scrollY } = useScroll();
  const [activeItem, setActiveItem] = useState('');
  const navRef = useRef(null);

  // Spotlight Effect State
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  // Handle Spotlight Mouse Move
  const handleNavMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // 1, 2, 12: Floating Navbar Animations tied to scroll
  const navTop = useTransform(scrollY, [0, 100], ['3.5rem', '2.5rem']);
  const navScale = useTransform(scrollY, [0, 100], [0.97, 1]);
  const navBackground = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.75)']);
  const navBackdropBlur = useTransform(scrollY, [0, 100], ['blur(8px)', 'blur(20px)']);
  const navShadow = useTransform(scrollY, [0, 100], ['0 0px 0px rgba(0,0,0,0)', '0 15px 50px rgba(0,0,0,0.08)']);
  const navBorder = useTransform(scrollY, [0, 100], ['1px solid rgba(255,255,255,0.1)', '1px solid rgba(0,0,0,0.08)']);

  // 11, 15: Top Progress Bar & Bottom Border Animation
  const scaleX = useSpring(useTransform(scrollY, [0, 2000], [0, 1]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Calculate window height for scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / docHeight, 1);
      scaleX.set(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .premium-nav-container {
              padding: 0.5rem 1rem !important;
              width: 95% !important;
              top: 1rem !important; /* Keep it fixed at top on mobile without transform jumping */
            }
            .hide-on-mobile {
              display: none !important;
            }
            /* Adjust spacing for mobile */
            .premium-nav-container > div {
              gap: 0.5rem !important;
            }
            .premium-logo {
              font-size: 1.2rem !important;
            }
            .premium-lang-switch {
              width: 60px !important;
            }
          }
        `}
      </style>
      {/* 15. Scroll Progress Bar at very top */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--primary)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 2001
        }}
      />

      {/* 16. Entrance Animation */}
      <motion.nav
        ref={navRef}
        className="premium-nav-container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.165, 0.84, 0.44, 1] }}
        onMouseMove={handleNavMouseMove}
        onMouseEnter={() => setIsHoveringNav(true)}
        onMouseLeave={() => setIsHoveringNav(false)}
        style={{
          position: 'fixed',
          top: navTop,
          left: '50%',
          x: '-50%',
          width: '90%',
          maxWidth: '1200px',
          zIndex: 1500,
          padding: '0.8rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '100px',
          background: navBackground,
          backdropFilter: navBackdropBlur,
          WebkitBackdropFilter: navBackdropBlur,
          boxShadow: navShadow,
          border: navBorder,
          scale: navScale,
          transformOrigin: 'center top'
        }}
        whileHover={{ y: -2 }} // 13. Hover Lift
      >
        {/* 14. Spotlight Effect Glow */}
        <AnimatePresence>
          {isHoveringNav && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '100px',
                pointerEvents: 'none',
                background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(199,160,60,0.1), transparent 40%)`,
                zIndex: 0
              }}
            />
          )}
        </AnimatePresence>

        {/* 11. Bottom Border Animation Line */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
            transformOrigin: '0%',
            scaleX,
            opacity: useTransform(scrollY, [0, 100], [0, 0.6]),
            zIndex: 1
          }}
        />

        {/* 5. Logo Hover */}
        <div className="brand premium-logo" style={{ zIndex: 2, cursor: 'pointer', fontSize: '1.8rem' }}>
          Saumya <span className="italic">Sales</span>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', zIndex: 2 }}>
          {['catalog', 'aboutUs'].map((item) => (
            <div
              key={item}
              className="premium-nav-item hide-on-mobile"
              onMouseEnter={() => setActiveItem(item)}
              onMouseLeave={() => setActiveItem('')}
            >
              <a href={item === 'catalog' ? '#catalog' : '#about'} className="nav-link-text" style={{ position: 'relative', zIndex: 2, textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t[item]}
              </a>
              {/* 3. Active Menu Indicator (Golden Underline) & 7. Navigation Glow */}
              {activeItem === item && (
                <motion.div
                  layoutId="nav-glow"
                  className="nav-active-glow"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{
                    position: 'absolute',
                    inset: '-8px -16px',
                    background: 'rgba(199,160,60,0.12)',
                    borderRadius: '50px',
                    zIndex: 0
                  }}
                />
              )}
              
              {/* 6. Gold Hover Line (handled by CSS now on hover, but we can do it here with framer motion too) */}
              <div className="gold-hover-line"></div>
            </div>
          ))}

          {/* 10. Sliding Language Switch */}
          <MagneticWrapper strength={0.3}>
            <div className="premium-lang-switch" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{ display: 'flex', position: 'relative', background: 'rgba(0,0,0,0.05)', borderRadius: '50px', padding: '4px', cursor: 'pointer', width: '70px', alignItems: 'center', justifyContent: 'space-between' }}>
              <motion.div
                className="lang-pill"
                animate={{ x: lang === 'en' ? 0 : 34 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{ position: 'absolute', left: '4px', top: '4px', bottom: '4px', width: '28px', background: 'var(--text-dark)', borderRadius: '50px', zIndex: 1 }}
              />
              <div style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, zIndex: 2, color: lang === 'en' ? 'white' : 'var(--text-muted)', transition: 'color 0.3s' }}>EN</div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, zIndex: 2, color: lang === 'hi' ? 'white' : 'var(--text-muted)', transition: 'color 0.3s' }}>HI</div>
            </div>
          </MagneticWrapper>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 2 }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user?.role === 'ADMIN' && (
                <MagneticWrapper strength={0.4}>
                  <button onClick={() => setAdminView(true)} className="premium-cta-btn admin hide-on-mobile">Admin Panel</button>
                </MagneticWrapper>
              )}
              <span className="hide-on-mobile" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Hi, {user?.name}</span>
              <MagneticWrapper strength={0.4}>
                <button onClick={logout} className="premium-cta-btn secondary hide-on-mobile">Logout</button>
              </MagneticWrapper>
            </div>
          ) : (
            <>
              <div className="hide-on-mobile">
                <MagneticWrapper strength={0.4}>
                  <button onClick={() => setAuthModalOpen(true)} className="premium-cta-btn secondary">
                    {t.customerLogin}
                  </button>
                </MagneticWrapper>
              </div>
              <div className="hide-on-mobile">
                <MagneticWrapper strength={0.4}>
                  <button onClick={() => setAuthModalOpen(true)} className="premium-cta-btn primary">
                    {t.retailerLogin}
                  </button>
                </MagneticWrapper>
              </div>
            </>
          )}

          {/* 9. Inquiry Badge Animation */}
          <MagneticWrapper strength={0.6}>
            <div className="premium-inquiry-pill" onClick={() => setOverlayOpen(true)}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em' }}>{t.inquiry}</span>
              <motion.div 
                className={`inquiry-badge ${totalCount > 0 ? 'has-items' : ''}`}
                key={totalCount}
                initial={{ scale: 1.5, filter: "brightness(1.5)" }}
                animate={{ scale: 1, filter: "brightness(1)" }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {totalCount}
              </motion.div>
            </div>
          </MagneticWrapper>
        </div>
      </motion.nav>
    </>
  );
};

export default PremiumNavbar;
