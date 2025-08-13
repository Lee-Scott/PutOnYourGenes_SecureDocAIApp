import React from 'react';

interface FooterCTAProps {
  onCTAClick: () => void;
}

const FooterCTA: React.FC<FooterCTAProps> = ({ onCTAClick }) => {
  return (
    <section className="footer-cta-section">
      <h2>Ready to Start?</h2>
      <p>Take the first step towards a healthier you. Our comprehensive assessment is quick, easy, and insightful.</p>
      <button 
        className="cta-button cta-secondary"
        onClick={onCTAClick}
        aria-label="Start your health assessment now"
      >
        Start Your Assessment
      </button>
    </section>
  );
};

export default FooterCTA;
