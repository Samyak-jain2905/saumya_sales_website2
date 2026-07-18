import React from 'react';

const PriceTierTable = ({ tiers }) => {
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className="price-tier-table" style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.8rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Bulk Discounts:</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {tiers.map(tier => (
          <div key={tier.id} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>{tier.minQuantity}+ pcs</span>
            <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{tier.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTierTable;
