import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, useSpring } from 'framer-motion';
import CountUpLib from 'react-countup';
const CountUp = CountUpLib.default || CountUpLib;
import { Trophy, Handshake, Package, Star } from 'lucide-react';

const AnimatedStats = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [mousePos, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse Parallax effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(mousePos.x * 8, springConfig);
  const parallaxY = useSpring(mousePos.y * 8, springConfig);

  const stats = [
    { value: 6, suffix: '+', label: "Years of Legacy", icon: <Trophy size={28} /> },
    { value: 100, suffix: '+', label: "Retail Partners", icon: <Handshake size={28} /> },
    { value: 15, suffix: 'k', label: "Orders Delivered", icon: <Package size={28} /> },
    { value: 4.9, suffix: '', label: "Customer Rating", icon: <Star size={28} />, decimals: 1 }
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ 
        position: 'relative', 
        padding: '6rem 0', 
        background: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* 5. Floating Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(circle, rgba(199,160,89,0.18), transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* 10. Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage: 'radial-gradient(var(--text-dark) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* 12. Scroll Zoom & Fade In for entire row */}
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ x: parallaxX, y: parallaxY }} // 6. Mouse Parallax
        >
          <div style={{ position: 'relative', padding: '2rem 0' }}>
            
            {/* 11. Gold Line Connection */}
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '5%',
                right: '5%',
                height: '1px',
                background: 'rgba(199,160,89,0.3)',
                zIndex: -1,
                originX: 0
              }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
            />

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '2rem',
              alignItems: 'center'
            }}>
              {stats.map((stat, index) => {
                const delayTime = 0.1 + (index * 0.15); // 0.1s, 0.25s, 0.4s, 0.55s
                return (
                  <motion.div
                    key={index}
                    className="animated-stat-card glass-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    whileHover={{ 
                      scale: 1.08, 
                      y: -8, 
                      borderColor: 'var(--primary)',
                      boxShadow: '0 20px 40px rgba(199,160,89,0.15)'
                    }}
                    transition={{ duration: 0.5, delay: isInView ? delayTime : 0, ease: "easeOut" }}
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      borderRadius: '16px',
                      border: '1px solid transparent',
                      position: 'relative'
                    }}
                  >
                    <div className="stat-icon" style={{ 
                      color: 'var(--primary)', 
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {stat.icon}
                    </div>
                    
                    <motion.h3 
                      className="stat-number gold-pulse" 
                      style={{ 
                        fontSize: '3rem', 
                        color: 'var(--text-dark)', 
                        marginBottom: '0.5rem',
                        fontWeight: '800'
                      }}
                    >
                      {isInView ? (
                        <CountUp 
                          start={0} 
                          end={stat.value} 
                          duration={2.5} 
                          decimals={stat.decimals || 0}
                          delay={delayTime}
                        />
                      ) : "0"}
                      {stat.suffix}
                    </motion.h3>
                    
                    <motion.p 
                      className="stat-label" 
                      style={{ 
                        color: 'var(--text-muted)', 
                        fontWeight: '500',
                        fontSize: '1rem',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {stat.label}
                    </motion.p>
                  </motion.div>
                );
              })}
            </div>

            {/* 4. Animated Underline (Overall) */}
            <motion.div
              style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                marginTop: '4rem',
                margin: '4rem auto 0 auto',
                originX: 0.5
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedStats;
