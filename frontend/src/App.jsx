import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import CountUpLib from 'react-countup';
const CountUp = CountUpLib.default || CountUpLib;
import { PremiumLoader, ScrollProgressBar, FloatingContactIcons, FloatingParticles, CustomCursor, MouseRipple, FloatingBlobs, TypewriterText, FaqAccordion, MagneticButton } from './components/PremiumComponents';
import AnimatedStats from './components/AnimatedStats';
import PremiumNavbar from './components/PremiumNavbar';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import './index.css';
import ProductCatalog from './components/ProductCatalog';
import { InquiryProvider, useInquiry } from './context/InquiryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import InquiryOverlay from './components/InquiryOverlay';
import AuthModal from './components/AuthModal';
import AboutContact from './pages/AboutContact';
import TrustElements from './components/TrustElements';
import AdminDashboard from './pages/AdminDashboard';
import { translations } from './utils/translations';
import { LanguageSwitcher, FestivalBanner, MobileBottomNav } from './components/UtilityComponents';
import CallBackModal from './components/CallBackModal';
import ShopGallery from './components/ShopGallery';

const AppContent = () => {
  const { totalCount } = useInquiry();
  const { user, logout, isLoggedIn } = useAuth();
  const [lang, setLang] = useState(localStorage.getItem('saumya_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('saumya_lang', lang);
  }, [lang]);
  const t = translations[lang];

  // Phase 2: Parallax Mouse Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-20, 20]);
  const bgY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-20, 20]);
  
  const handleHeroMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isCallBackOpen, setCallBackOpen] = useState(false);
  const [isAdminView, setAdminView] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productInterest: 'Crockery',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('Enquiry Sent Successfully!');
        setFormData({ name: '', phone: '', email: '', productInterest: 'Crockery', message: '' });
      } else {
        setStatus('Failed to send enquiry. Please try again.');
      }
    } catch (error) {
      setStatus('Server Error. Please try again later.');
    }
  };

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });

    // Observe existing ones
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Watch for new .reveal elements being added to the DOM
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (node.classList && node.classList.contains('reveal')) {
              io.observe(node);
            }
            // Also check children
            const childReveals = node.querySelectorAll ? node.querySelectorAll('.reveal') : [];
            childReveals.forEach(el => io.observe(el));
          }
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      setAdminView(true);
    } else {
      setAdminView(false);
    }
  }, [user]);

  if (isAdminView && user?.role === 'ADMIN') {
    return (
      <div className="app">

        <nav className="glass-card" style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1200px', zIndex: 1500, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="brand" style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Saumya Sales <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>ADMIN</span></div>
          <button onClick={() => setAdminView(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Exit Admin</button>
        </nav>
        <AdminDashboard />
        <FloatingContactIcons />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
    <motion.div 
      key={lang}
      className="app"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="bg-noise" />
      <div className="bg-grid" />
      <CustomCursor />
      <MouseRipple />
      <FloatingBlobs />
      <PremiumLoader />

      <ScrollProgressBar />
      <FloatingContactIcons />
      <FestivalBanner />

      <PremiumNavbar 
        lang={lang} 
        setLang={setLang} 
        user={user} 
        logout={logout} 
        isLoggedIn={isLoggedIn} 
        totalCount={totalCount} 
        setAuthModalOpen={setAuthModalOpen} 
        setOverlayOpen={setOverlayOpen} 
        setAdminView={setAdminView} 
        t={t} 
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} t={t} lang={lang} />
      <InquiryOverlay isOpen={isOverlayOpen} onClose={() => setOverlayOpen(false)} t={t} lang={lang} />
      <CallBackModal isOpen={isCallBackOpen} onClose={() => setCallBackOpen(false)} t={t} lang={lang} />

      {/* Hero Section */}
      <section className="hero" onMouseMove={handleHeroMouseMove}>
        <FloatingParticles />
        <motion.div className="hero-pattern" style={{ x: bgX, y: bgY, scale: 1.05 }}></motion.div>
        
        {/* Floating Background Glow (Phase 2) */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }}></div>

        <div className="hero-content" style={{ textAlign: 'left', maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span style={{ color: 'var(--primary)' }}>⭐</span> Trusted Wholesale Supplier Since 2020
          </motion.div>
          
          {/* Staggered Text Reveal (Phase 2) */}
          <motion.h1
             initial="hidden"
             animate="visible"
             variants={{
               hidden: { opacity: 0 },
               visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
             }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
              Crafting
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
              <span className="italic">Exceptional</span>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
              Bulk Experiences
            </motion.div>
          </motion.h1>
          
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.5 }}
             style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}
          >
             <TypewriterText texts={['Premium Crockery', 'Premium Plastic', 'Kitchen Essentials', 'Bulk Supply']} speed={120} pause={2500} />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontSize: '1.2rem', maxWidth: '550px', margin: '0 0 4rem 0', color: 'var(--text-muted)' }}
          >
            Serving retailers, wholesalers, hotels, restaurants, caterers, institutions, and households with premium-quality crockery, plasticware, kitchen essentials, storage solutions, and household products at competitive wholesale prices.
          </motion.p>
          <motion.div 
            className="cta-group" 
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '1.5rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <MagneticButton>
              <a href="#catalog" className="btn btn-primary btn-premium btn-animated-gradient">Explore Products <span className="btn-arrow">→</span></a>
            </MagneticButton>
            <MagneticButton>
              <button onClick={() => setCallBackOpen(true)} className="btn btn-primary btn-premium btn-animated-gradient">Contact Sales <span className="btn-arrow">→</span></button>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <AnimatedStats />

      <div className="section-divider"><span className="section-divider-icon">◇</span></div>

      {/* Experience Section - Bento Grid Revamp */}
      <section className="experience-section" style={{ background: 'white', position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles />
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <h2 className="premium-gradient-text" style={{ fontSize: '4rem', marginBottom: '2rem' }}>The Saumya <span className="italic">Experience</span></h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>More than just a supplier—we help retailers, wholesalers, hotels, restaurants, and institutions source quality products at competitive prices with dependable service.</p>
          </div>
          
          <div className="bento-grid">
            {/* Card 1 */}
            <div className="bento-item bento-large reveal reveal-delay-1" style={{ background: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.3)), url("https://images.unsplash.com/photo-1604514813560-1e4f5726f952?auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
               <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍽️</div>
               <h3 style={{ color: 'var(--text-dark)' }}>{t.bento1Title}</h3>
               <p style={{ maxWidth: '350px' }}>{t.bento1Desc}</p>
               <a href="#catalog" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block', padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>{t.viewCollection}</a>
            </div>
            {/* Card 2 */}
            <div className="bento-item bento-medium reveal reveal-delay-2" style={{ background: 'var(--text-dark)', color: 'white' }}>
               <div className="icon-box" style={{ background: 'var(--primary)', marginBottom: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤝</div>
               <h3>{t.bento2Title}</h3>
               <p style={{ color: 'rgba(255,255,255,0.6)' }}>{t.bento2Desc}</p>
            </div>
            {/* Card 3 */}
            <div className="bento-item bento-small reveal reveal-delay-3" style={{ justifyContent: 'flex-start', padding: '2.5rem' }}>
               <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏭</div>
               <h3 style={{ fontSize: '1.4rem' }}>{t.bento3Title}</h3>
               <p>{t.bento3Desc}</p>
            </div>
            {/* Card 4 */}
            <div className="bento-item bento-small reveal reveal-delay-3" style={{ background: 'var(--bg-warm)', justifyContent: 'flex-start', padding: '2.5rem' }}>
               <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📦</div>
               <h3 style={{ fontSize: '1.4rem' }}>{t.bento4Title}</h3>
               <p>{t.bento4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"><span className="section-divider-icon">◇</span></div>

      <ShopGallery />

      <div className="reveal">
        <TrustElements />
      </div>

      {/* Product Catalog Section */}
      <div className="reveal">
        <ProductCatalog t={t} lang={lang} />
      </div>

      {/* CTA Banner */}
      <section className="cta-banner reveal">
        <FloatingParticles />
        <div className="container gold-glow">
          <div className="reveal-delay-1" style={{ marginBottom: '4rem' }}>
             <span style={{ color: 'var(--primary)', fontSize: '4rem' }}>🎖️</span>
          </div>
          <h2 className="reveal-delay-2 premium-gradient-text">Ready to Stock <span className="italic">Your Business?</span></h2>
          <p className="reveal-delay-3" style={{ fontSize: '1.3rem', marginBottom: '4rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto 4rem auto' }}>Partner with Saumya Sales for premium crockery, plastic products, kitchen essentials, and household items at competitive wholesale prices.</p>
          <div className="reveal-delay-4 cta-group" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <MagneticButton>
              <a href="#catalog" className="btn btn-primary btn-premium btn-animated-gradient" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Browse Product Catalog <span className="btn-arrow">→</span></a>
            </MagneticButton>
            <MagneticButton>
              <button onClick={() => setOverlayOpen(true)} className="btn btn-primary btn-premium btn-animated-gradient" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Request Wholesale Pricing <span className="btn-arrow">→</span></button>
            </MagneticButton>
          </div>
        </div>
      </section>

      <div className="reveal">
        <AboutContact />
      </div>

      {/* FAQ Section */}
      <section className="reveal" style={{ padding: '6rem 2rem', background: 'var(--bg-warm)' }}>
        <div className="container">
          <h2 className="section-title">Frequently Asked <span className="italic">Questions</span></h2>
          <FaqAccordion items={[
            { question: "What is the minimum order quantity for wholesale?", answer: "Our minimum order quantity varies by product category. Generally, for crockery and plasticware, we require a minimum bulk order value of ₹10,000 to avail wholesale pricing." },
            { question: "Do you offer custom branding on products?", answer: "Yes, we offer custom branding and logo printing for bulk orders on select products, perfect for corporate gifting, restaurants, and hotels." },
            { question: "How long does shipping take?", answer: "We partner with reliable transport services. Depending on your location in India, delivery typically takes between 3 to 7 business days." },
            { question: "Can I request product samples before placing a bulk order?", answer: "Absolutely. We can arrange product samples for a nominal fee so you can verify the premium quality before committing to a larger order." }
          ]} />
        </div>
      </section>

      {/* Infinite Categories Marquee */}
      <div className="infinite-marquee">
        <div className="infinite-marquee-content">
           <span>Premium</span> • <span>Wholesale</span> • <span>Retail</span> • <span>Kitchen</span> • <span>Plastic</span> • <span>Crockery</span> •
           <span>Premium</span> • <span>Wholesale</span> • <span>Retail</span> • <span>Kitchen</span> • <span>Plastic</span> • <span>Crockery</span> •
           <span>Premium</span> • <span>Wholesale</span> • <span>Retail</span> • <span>Kitchen</span> • <span>Plastic</span> • <span>Crockery</span>
        </div>
      </div>

      <motion.footer 
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        style={{ background: 'var(--text-dark)', color: 'white', padding: '6rem 0' }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
            <div className="footer-brand">
              <div className="brand" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white' }}>Saumya <span className="italic">Sales</span></div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '2' }}>Premier wholesale supplier of crockery and houseware plastic essentials since 2020.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><a href="#catalog" className="footer-link">{t.productCatalog}</a></li>
                <li><a href="#about" className="footer-link">{t.aboutOurLegacy}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCallBackOpen(true); }} className="footer-link">{t.footerSupport}</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>{t.footerConnect}</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>Saumya Sales Bus Stand, Agar Malwa, Madhya Pradesh</p>
              <p style={{ color: 'white', fontWeight: '700', marginBottom: '1.5rem' }}>+91 74894 70244</p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                 <button onClick={() => window.open('https://maps.app.goo.gl/Akt7arGMRGMTEd1G8')} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>{t.footerGetDirections}</button>
                 <button onClick={() => window.location.href='tel:+917489470244'} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>{t.footerCallNow}</button>
                 <button onClick={() => navigator.clipboard.writeText('Saumya Sales Bus Stand, Agar Malwa, Madhya Pradesh')} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>{t.footerCopyAddress}</button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4rem', paddingTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.8rem', opacity: 0.4 }}>{t.footerRights}</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.footerBackToTop}</button>
          </div>
        </div>
      </motion.footer>
      
      <MobileBottomNav setOverlayOpen={setOverlayOpen} setCallBackOpen={setCallBackOpen} />
    </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <AuthProvider>
    <InquiryProvider>
      <AppContent />
    </InquiryProvider>
  </AuthProvider>
);

export default App;
