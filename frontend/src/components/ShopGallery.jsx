import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from './PremiumComponents';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ShopGallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/shop-photos`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPhotos(data);
                } else {
                    console.error('Invalid data format received:', data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching shop photos:', err);
                setLoading(false);
            });
    }, []);

    // Phase 4: Autoplay Carousel
    useEffect(() => {
        if (photos.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % photos.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [photos.length]);

    if (loading) return (
        <section className="shop-gallery" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p>Loading gallery...</p>
        </section>
    );

    return (
        <section className="shop-gallery experience-section" style={{ padding: '6rem 0', background: '#fdfbf7', minHeight: '400px', position: 'relative', overflow: 'hidden' }}>
            <FloatingParticles />
            <div className="container">
                <div className="reveal active" style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 className="premium-gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Our <span className="italic">Establishment</span></h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Step into our showroom and witness our extensive collection of premium boutique products first-hand.
                    </p>
                </div>

                {photos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                        <p>No photos have been uploaded to the gallery yet.</p>
                        <p style={{ fontSize: '0.9rem' }}>Admins can add photos via the Admin Dashboard.</p>
                    </div>
                ) : (
                    <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', height: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={currentIndex}
                                src={photos[currentIndex].imageUrl}
                                alt={`Gallery ${currentIndex}`}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                            />
                        </AnimatePresence>
                        
                        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.8rem', background: 'rgba(255,255,255,0.3)', padding: '0.5rem 1rem', borderRadius: '50px', backdropFilter: 'blur(10px)' }}>
                            {photos.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setCurrentIndex(idx)}
                                    style={{ 
                                        width: idx === currentIndex ? '30px' : '10px', 
                                        height: '10px', 
                                        borderRadius: '10px', 
                                        background: idx === currentIndex ? 'var(--primary)' : 'rgba(0,0,0,0.4)', 
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShopGallery;
