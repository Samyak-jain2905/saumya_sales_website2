import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from './PremiumComponents';

const TrustElements = () => {
  const testimonials = [
    { name: "Rahul Sharma", role: "Retail Store Owner", text: "Saumya Sales has been our trusted supplier for years. Their product quality, pricing, and delivery are consistently excellent." },
    { name: "Amit Patel", role: "Wholesale Distributor", text: "A wide variety of products at wholesale prices. Their service and stock availability make them our preferred supplier." },
    { name: "Suresh Gupta", role: "Hotel Supplier", text: "Reliable quality and quick delivery. Perfect partner for our bulk kitchenware requirements." }
  ];

  const trustMarks = [
    "6+ Years Trust",
    "Secure Payments",
    "Fast Delivery",
    "Bulk Orders",
    "Genuine Products"
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="trust-section" style={{ padding: '6rem 0', background: '#020617', position: 'relative', overflow: 'hidden' }}>
      <FloatingParticles />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Why Businesses Choose Us */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title premium-gradient-text" style={{ color: 'white' }}>Why Businesses Choose Saumya Sales</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
            Thousands of retailers and businesses trust us for consistent quality, competitive pricing, and dependable customer support.
          </p>
        </div>

        {/* Phase 4: Business Trust Section (5 Checkmarks) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
          {trustMarks.map((mark, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>✓</div>
              <span style={{ color: 'white', fontWeight: '600', letterSpacing: '0.05em' }}>{mark}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
          {[
            { title: "Competitive Wholesale Prices", desc: "Affordable pricing designed to maximize your business profits." },
            { title: "Wide Product Selection", desc: "Thousands of crockery, plastic, kitchenware, and household products available in one place." },
            { title: "Trusted Quality", desc: "Products sourced from reliable manufacturers and well-known brands." },
            { title: "Fast Order Processing", desc: "Quick quotation, order confirmation, and timely delivery for bulk purchases." },
            { title: "Bulk Order Support", desc: "Special pricing and dedicated assistance for wholesalers, retailers, institutions, hotels, and restaurants." },
            { title: "Customer Satisfaction", desc: "We focus on building long-term relationships through honest pricing and dependable service." }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>{item.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Phase 4: Testimonials Autoplay Slider */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title premium-gradient-text" style={{ color: 'white' }}>What Our Partners Say</h2>
        </div>
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 8rem auto', height: '250px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                "{testimonials[currentTestimonial].text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#020617', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: 'white', margin: 0 }}>{testimonials[currentTestimonial].name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{testimonials[currentTestimonial].role}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div style={{ position: 'absolute', bottom: '-2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
            {testimonials.map((_, i) => (
              <div key={i} onClick={() => setCurrentTestimonial(i)} style={{ width: i === currentTestimonial ? '30px' : '10px', height: '10px', borderRadius: '10px', background: i === currentTestimonial ? 'var(--primary)' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }} />
            ))}
          </div>
        </div>

        {/* Phase 4: Brand Logos Grayscale Hover */}
        <div style={{ textAlign: 'center', overflow: 'hidden' }}>
          <h2 className="section-title premium-gradient-text" style={{ color: 'white' }}>Trusted Brands We Supply</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', fontSize: '1.1rem' }}>We proudly offer products from India's most trusted household and kitchenware brands.</p>
          <div className="marquee-container" style={{ opacity: 0.8, background: 'rgba(255,255,255,0.02)', padding: '3rem 0', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="marquee-content" style={{ gap: '5rem' }}>
              {['Milton', 'Cello', 'Borosil', 'La Opala', 'Signoraware', 'Nayasa', 'Princeware', 'Pigeon'].map((brand, i) => (
                 <span key={i} className="brand-logo-hover" style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '3px', filter: 'grayscale(100%) opacity(0.4)', transition: 'all 0.4s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(100%) opacity(0.4)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}>{brand}</span>
              ))}
              {['Milton', 'Cello', 'Borosil', 'La Opala', 'Signoraware', 'Nayasa', 'Princeware', 'Pigeon'].map((brand, i) => (
                 <span key={`dup-${i}`} className="brand-logo-hover" style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '3px', filter: 'grayscale(100%) opacity(0.4)', transition: 'all 0.4s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(100%) opacity(0.4)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}>{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustElements;
