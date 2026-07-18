import React, { createContext, useContext, useState, useEffect } from 'react';

const InquiryContext = createContext();

export const useInquiry = () => useContext(InquiryContext);

export const InquiryProvider = ({ children }) => {
  const [inquiryItems, setInquiryItems] = useState(() => {
    const saved = localStorage.getItem('saumya_inquiry');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('saumya_inquiry', JSON.stringify(inquiryItems));
  }, [inquiryItems]);

  const addToInquiry = (product) => {
    setInquiryItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromInquiry = (id) => {
    setInquiryItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setInquiryItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const clearInquiry = () => setInquiryItems([]);

  return (
    <InquiryContext.Provider value={{ 
      inquiryItems, 
      addToInquiry, 
      removeFromInquiry, 
      updateQuantity, 
      clearInquiry,
      totalCount: inquiryItems.length
    }}>
      {children}
    </InquiryContext.Provider>
  );
};
