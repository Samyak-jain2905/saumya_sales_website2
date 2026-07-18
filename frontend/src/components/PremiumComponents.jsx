import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Coffee, Disc, ChevronDown } from 'lucide-react';

export const MagneticButton = ({ children, className = '', style = {}, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (window.innerWidth <= 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    x.set(offsetX * 0.15); // moves max ~3px for typical button sizes
    y.set(offsetY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ ...style, x: smoothX, y: smoothY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const TiltCard = ({ children, className, style }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 100 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (window.innerWidth <= 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        perspective: 1000,
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export const MouseRipple = () => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600); // matches CSS animation duration
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="mouse-ripple"
          style={{
            left: ripple.x - 20, // offset half of initial width
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </>
  );
};

export const TypewriterText = ({ texts, speed = 100, pause = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentText = texts[index];
      
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        if (displayText.length === currentText.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((index + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, texts, speed, pause]);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {displayText}
      <span className="typewriter-cursor"></span>
    </span>
  );
};

export const FloatingBlobs = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.05) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.06) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
};

export const FaqAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`faq-item glass-card-premium ${isOpen ? 'open' : ''}`} style={{ padding: '1.5rem', borderRadius: '15px', cursor: 'pointer' }} onClick={() => toggle(index)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{item.question}</h4>
              <ChevronDown className="faq-icon" size={24} style={{ color: 'var(--primary)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>
            <div className={`faq-content ${isOpen ? 'open' : ''}`} style={{ marginTop: isOpen ? '1rem' : '0' }}>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PremiumLoader = () => {
  const [loading, setLoading] = useState(true);
  const [exitPhase, setExitPhase] = useState(false);

  useEffect(() => {
    // 2.5 seconds total loading time
    const timer = setTimeout(() => {
      setExitPhase(true);
      setTimeout(() => setLoading(false), 600); // 600ms exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#FAF8F3',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#2F2422'
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exitPhase ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Sparkle/Glow Top */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: exitPhase ? 0 : [0.2, 1, 0.2], scale: exitPhase ? 0 : [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: '#D4AF37', fontSize: '1.5rem', marginBottom: '1rem' }}
      >
        ✨
      </motion.div>

      {/* The Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        animate={{
          opacity: exitPhase ? 0 : 1,
          scale: exitPhase ? 1.2 : 1, // Exit: scales slightly larger
          rotate: exitPhase ? 0 : 0,
          y: exitPhase ? -20 : [0, -6, 0] // Exit: floats up while scaling
        }}
        transition={{
          opacity: { duration: exitPhase ? 0.6 : 0.5 },
          scale: { duration: exitPhase ? 0.6 : 0.5 },
          rotate: { duration: 0.5 },
          y: exitPhase ? { duration: 0.6 } : {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
            delay: 0.5 // starts floating after entrance
          }
        }}
        style={{
          width: '60px',
          height: '60px',
          background: '#D4AF37',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
        }}
      >
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>S</span>
      </motion.div>

      {/* Brand Name Animation */}
      <div style={{ display: 'flex', gap: '0.5rem', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <motion.span
          initial={{ opacity: 0, letterSpacing: '8px' }}
          animate={{ opacity: 1, letterSpacing: '0px' }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
        >
          Saumya
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
          style={{ fontSize: '2.5rem', fontWeight: '300', fontStyle: 'italic' }}
        >
          Sales
        </motion.span>
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.0 }}
        style={{ color: '#7A6D65', fontSize: '1.1rem', marginBottom: '2rem', letterSpacing: '1px' }}
      >
        Premium Crockery • Plastic • Kitchenware
      </motion.div>

      {/* Loader Line */}
      <div style={{ width: '200px', height: '2px', background: 'rgba(212, 175, 55, 0.2)', position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: '#D4AF37' }}
        />
      </div>
      
      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
        style={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold' }}
      >
        Loading...
      </motion.div>
    </motion.div>
  );
};

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for glow and trail
  const smoothX = useSpring(cursorX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(cursorY, { damping: 25, stiffness: 150 });
  
  const trailX = useSpring(cursorX, { damping: 30, stiffness: 100 });
  const trailY = useSpring(cursorY, { damping: 30, stiffness: 100 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.closest('.btn') ||
        e.target.closest('a') ||
        e.target.closest('.inquiry-nav-pill') ||
        e.target.closest('.product-card')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* 1. Global Mouse Glow */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9997,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />
      
      {/* 2. Cursor Trail */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '4px', height: '4px',
          background: 'rgba(212, 175, 55, 0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />

      {/* 3. Main Cursor Dot */}
      <motion.div 
        className="custom-cursor-dot" 
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }} 
      />
      
      {/* 4. Main Cursor Outline (Enlarges on hover) */}
      <motion.div 
        className={`custom-cursor-outline ${isHovering ? 'hovering' : ''}`} 
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }} 
      />
    </>
  );
};

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX }}
    />
  );
};

export const FloatingContactIcons = () => {
  return (
    <div className="floating-contact-container">
      <style>
        {`
          .floating-contact-container {
            position: fixed;
            bottom: 40px;
            right: 40px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 15px;
            z-index: 1500;
          }
          .floating-btn {
            color: white;
            border-radius: 50px;
            display: flex;
            align-items: center;
            padding: 10px;
            text-decoration: none;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            height: 52px;
          }
          .floating-btn .btn-text {
            max-width: 0;
            opacity: 0;
            white-space: nowrap;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            font-weight: bold;
            font-size: 0.9rem;
          }
          .floating-btn:hover {
            transform: translateY(-5px);
            padding: 10px 20px 10px 15px !important;
          }
          .floating-btn:hover .btn-text {
            max-width: 150px;
            opacity: 1;
            margin-left: 10px;
          }
          .wa-btn {
            background: #25D366;
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
          }
          .wa-btn:hover {
            box-shadow: 0 15px 40px rgba(37, 211, 102, 0.6);
          }
          .phone-btn {
            background: var(--primary);
            box-shadow: 0 10px 30px rgba(184, 134, 11, 0.4);
          }
          .phone-btn:hover {
            box-shadow: 0 15px 40px rgba(184, 134, 11, 0.6);
          }
          @media (max-width: 768px) {
            .floating-contact-container {
              bottom: 80px; /* Above mobile bottom nav */
              right: 20px;
              gap: 10px;
            }
            .floating-btn {
              padding: 8px;
              height: 48px;
            }
            .floating-btn .btn-text {
              display: none; /* Hide text completely on small screens to save space */
            }
          }
        `}
      </style>
      <a href="tel:+917489470244" className="floating-btn phone-btn">
        <span style={{ fontSize: '1.5rem', lineHeight: '32px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</span>
        <span className="btn-text">Call Us</span>
      </a>
      <a href="https://wa.me/917489470244" target="_blank" rel="noreferrer" className="floating-btn wa-btn">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: '32px', height: '32px' }} />
        <span className="btn-text">Need Help?</span>
      </a>
    </div>
  );
};

export const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 25 }).map((_, i) => {
      const typeRand = Math.random();
      let type = 'dot';
      if (typeRand > 0.8) type = 'mug';
      else if (typeRand > 0.6) type = 'plate';

      return {
        id: i,
        type,
        size: type === 'dot' ? Math.random() * 8 + 6 : Math.random() * 24 + 32,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 15 + 15, // 15 to 30 seconds
        delay: Math.random() * -30, // Negative delay to start mid-animation
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div className="floating-particles-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>
        {`
          @keyframes floatUpInfinite {
            0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: 0,
            color: 'var(--primary)',
            animation: `floatUpInfinite ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
          }}
        >
          {p.type === 'mug' && <Coffee size={p.size} opacity={0.6} />}
          {p.type === 'plate' && <Disc size={p.size} opacity={0.6} />}
          {p.type === 'dot' && <div style={{ width: p.size, height: p.size, background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 12px var(--primary)', opacity: 0.8 }} />}
        </div>
      ))}
    </div>
  );
};
