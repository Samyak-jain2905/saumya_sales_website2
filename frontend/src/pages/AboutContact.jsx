import React from 'react';
import { motion } from 'framer-motion';
const AboutContact = () => {
  return (
    <section id="about" className="about-section" style={{ padding: '8rem 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* About Content & Image (Phase 4) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, var(--text-dark), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '5rem' }}>
                🏢
              </div>
            </motion.div>

            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="section-title premium-gradient-text" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>About Saumya Sales</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                Saumya Sales is a trusted wholesale and retail supplier specializing in premium crockery, plasticware, kitchen essentials, and household products. Since 2020, we have been serving retailers, wholesalers, hotels, restaurants, caterers, institutions, and individual customers with quality products at competitive prices.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                Our extensive product range includes dinnerware, storage containers, water bottles, lunch boxes, kitchen accessories, cleaning essentials, and everyday household items from leading brands.
              </p>
              
              <div className="contact-details glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Saumya Sales</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>
                      <span style={{ background: '#4ade80', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>OPEN</span> 09:00 AM — 09:00 PM
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-warm)', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                     <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Plus Code</div>
                     <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>P274+R9 Agar</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                    <div style={{ width: '30px', height: '30px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '0.9rem' }}>📍</div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.2rem' }}>Main Hub</span>
                      <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>Bus Stand, Agar Malwa, MP 465441</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                    <div style={{ width: '30px', height: '30px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '0.9rem' }}>📞</div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.2rem' }}>Inquiry Line</span>
                      <a href="tel:7489470244" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600' }}>+91 74894 70244</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map Section (Phase 4 Zoom Hover) */}
          <motion.div 
            className="map-container glass-card" 
            style={{ height: '100%', minHeight: '550px', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.5s ease', cursor: 'pointer' }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ marginBottom: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>📍</span> Our Location
            </h3>
            <div style={{ width: '100%', flexGrow: 1, borderRadius: '12px', overflow: 'hidden', minHeight: '350px' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.883726715001!2d76.0059741!3d23.7144938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39649700551652a7%3A0x4a9613df81795b71!2sSaumya%20sales!5e0!3m2!1sen!2sin!4v1714658997000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Saumya Sales Location"
              ></iframe>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <a 
                href="https://maps.app.goo.gl/Akt7arGMRGMTEd1G8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-premium"
                style={{ padding: '1rem 2rem', fontSize: '1rem', width: '100%', display: 'block' }}
              >
                Open in Google Maps <span className="btn-arrow">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
