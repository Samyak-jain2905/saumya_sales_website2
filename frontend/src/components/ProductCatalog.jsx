import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useInquiry } from '../context/InquiryContext';
import { useAuth } from '../context/AuthContext';
import PriceTierTable from './PriceTierTable';
import { TiltCard } from './PremiumComponents';

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} lazy-image ${loaded ? 'loaded' : ''}`}
      onLoad={() => setLoaded(true)}
    />
  );
};

const ProductCatalog = ({ t, lang }) => {
  const { addToInquiry } = useInquiry();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    size: ''
  });
  const [loading, setLoading] = useState(true);
  
  // Phase 3: Premium Search & Quick View
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.size) params.append('size', filters.size);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Invalid data format received:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="catalog" className="catalog-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title premium-gradient-text">{t.productCatalog}</h2>
        </div>

        {isLoggedIn && <p style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '2rem', fontWeight: 'bold' }}>✓ You are viewing Wholesale Pricing</p>}

        {/* Phase 3: Premium Search Bar with Autocomplete */}
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 2rem auto', zIndex: 100 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
            <input 
              type="text" 
              placeholder={t.catSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              style={{ width: '100%', padding: '1.2rem 1.5rem 1.2rem 3.5rem', borderRadius: '50px', border: '1px solid var(--glass-border)', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}
              className="premium-search-input"
            />
          </div>
          <AnimatePresence>
            {showSuggestions && searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '100%', background: 'white', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}
              >
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map(p => (
                  <div 
                    key={p.id} 
                    style={{ padding: '1rem 1.5rem', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }} 
                    onClick={() => setSearchQuery(p.name)}
                    className="search-suggestion-item"
                  >
                    <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{lang === 'hi' && p.nameHi ? p.nameHi : p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.category}</div>
                    </div>
                  </div>
                ))}
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No suggestions found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar" style={{ position: 'relative', zIndex: 10 }}>
          <div className="filter-group">
            <label>{t.catSelectCategory}</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">{t.catAllProducts}</option>
              <option value="Dinner Sets">Dinner Sets</option>
              <option value="Plastic Containers">Plastic Containers</option>
              <option value="Water Bottles">Water Bottles</option>
              <option value="Lunch Boxes">Lunch Boxes</option>
              <option value="Kitchen Storage">Kitchen Storage</option>
              <option value="Household Items">Household Items</option>
              <option value="Buckets & Mugs">Buckets & Mugs</option>
              <option value="Glassware">Glassware</option>
              <option value="Serving Trays">Serving Trays</option>
              <option value="Kitchen Accessories">Kitchen Accessories</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Budget Limit</label>
            <input 
              type="number" 
              name="maxPrice" 
              placeholder="Up to ₹0.00" 
              value={filters.maxPrice} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className="filter-group">
            <label>Specifications</label>
            <input 
              type="text" 
              name="size" 
              placeholder="Size, Capacity, etc." 
              value={filters.size} 
              onChange={handleFilterChange} 
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '5rem' }}>Curating products...</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, index) => {
              const delayClass = `float-element-delay-${(index % 3) + 1}`;
              return (
              <TiltCard key={product.id} className={`product-card float-element ${delayClass}`}>
                <div className="product-image-wrapper">
                  <LazyImage src={product.imageUrl} alt={product.name} className="product-image" />
                  {isLoggedIn && <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }} className="wholesale-badge">Wholesale Rate</div>}
                  
                  {/* Phase 3: Quick View Overlay */}
                  <div className="quick-view-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.opacity=1} onMouseLeave={(e) => e.currentTarget.style.opacity=0}>
                    <button 
                      className="btn btn-secondary btn-premium" 
                      onClick={() => setQuickViewProduct(product)}
                      style={{ padding: '0.8rem 1.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    >
                      Quick View <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{lang === 'hi' && product.nameHi ? product.nameHi : product.name}</h3>
                  
                  <div className="product-specs">
                    <div className="spec-item">
                      <span className="spec-label">{t.catMOQ}</span>
                      <span className="spec-value">{product.moq} Units</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">{t.catSize}</span>
                      <span className="spec-value">{product.size}</span>
                    </div>
                    {product.material && (
                      <div className="spec-item">
                        <span className="spec-label">Material</span>
                        <span className="spec-value">{product.material}</span>
                      </div>
                    )}
                  </div>

                  <div className="product-price-row">
                    <div className="price-container">
                      <div className="price-main">
                        <small>₹</small>{isLoggedIn ? product.wholesalePrice : product.price}
                      </div>
                      {isLoggedIn && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          Retail: ₹{product.price}
                        </div>
                      )}
                    </div>
                    {isLoggedIn && <div style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '800' }}>{product.priceTiers?.length || 0} TIERS</div>}
                  </div>
                </div>

                <button 
                  onClick={() => addToInquiry(product)}
                  className="add-to-inquiry-btn"
                >
                  {t.catAddToInquiry} <span>→</span>
                </button>
              </TiltCard>
            )})}
          </div>
        )}
        
        {/* Phase 3: Premium Elegant Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--glass-border)' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.8 }}>🍽️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: 'var(--text-dark)' }}>No matching products</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We couldn't find any products matching your current filters or search query.</p>
            <button 
              className="btn btn-secondary btn-premium" 
              onClick={() => {
                setFilters({category:'', minPrice:'', maxPrice:'', size:''}); 
                setSearchQuery('');
              }}
            >
              Clear All Filters <span className="btn-arrow">→</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Phase 3: Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ position: 'relative', width: '90%', maxWidth: '900px', background: 'white', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'row', boxShadow: '0 40px 80px rgba(0,0,0,0.3)', maxHeight: '90vh' }}
            >
              <button onClick={() => setQuickViewProduct(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>✕</button>
              
              <div style={{ flex: 1, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <img src={quickViewProduct.imageUrl} alt={quickViewProduct.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
              </div>
              
              <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{quickViewProduct.category}</span>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem 0' }}>{lang === 'hi' && quickViewProduct.nameHi ? quickViewProduct.nameHi : quickViewProduct.name}</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>{lang === 'hi' && quickViewProduct.descriptionHi ? quickViewProduct.descriptionHi : quickViewProduct.description || 'Experience the perfect blend of durability and elegance. Ideal for bulk purchases and long-term use.'}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-warm)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum Order</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{quickViewProduct.moq} Units</div>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-warm)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dimensions / Size</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{quickViewProduct.size}</div>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price per unit</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>₹{isLoggedIn ? quickViewProduct.wholesalePrice : quickViewProduct.price}</div>
                  </div>
                  <button 
                    onClick={() => { addToInquiry(quickViewProduct); setQuickViewProduct(null); }} 
                    className="btn btn-primary btn-premium"
                  >
                    {t.catAddToInquiry} <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductCatalog;
