import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchUserQuery } from '../../service/UserService';
import './CoreFeatures.css';

const CoreFeaturesHero: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isSuccess } = useFetchUserQuery();

  const handleCTAClick = () => {
    if (isSuccess && user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="core-features-hero">
      <div className="hero-content">
        <h1 className="hero-headline">
          Intelligent Document Management, Powered by AI
        </h1>
        <p className="hero-subheadline">
          Securely upload, organize, and interact with your documents using powerful AI agents, chat, and smart tagging.
        </p>
        <button
          className="cta-button cta-primary"
          onClick={handleCTAClick}
          aria-label={isSuccess && user ? "Go to your dashboard" : "Sign up now"}
        >
          {isSuccess && user ? "Go to Dashboard" : "Sign Up Now"}
        </button>
      </div>
    </section>
  );
};

export default CoreFeaturesHero;