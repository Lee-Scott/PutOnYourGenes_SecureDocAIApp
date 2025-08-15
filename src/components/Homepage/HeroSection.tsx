import React from 'react';
import logo from '../../assets/logo.png';

interface HeroSectionProps {
  onCTAClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCTAClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <img src={logo} alt="PutOnYourGenes" className="hero-logo" />
        <h1 className="hero-headline">
          Personalized Health Starts Here
        </h1>
        <p className="hero-subheadline">
          Complete your health assessment and get personalized recommendations 
          based on your lab results and genetic data
        </p>
        <button 
          className="cta-button cta-primary"
          onClick={onCTAClick}
          aria-label="Start your health assessment"
        >
          Start Your Assessment
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
