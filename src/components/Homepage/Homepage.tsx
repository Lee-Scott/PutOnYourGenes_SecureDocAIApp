import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setVisitMetrics, updateJourneyStep } from '../../store/slices/homepageSlice';
import { RootState } from '../../store/store';
import HeroSection from './HeroSection';
import BenefitsSection from './BenefitsSection';
import ProcessSection from './ProcessSection';
import FooterCTA from './FooterCTA';
import CoreFeaturesHero from './CoreFeaturesHero';
import CoreFeaturesBenefits from './CoreFeaturesBenefits';
import './Homepage.css';
import './CoreFeatures.css';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userJourney } = useSelector((state: RootState) => state.homepage);

  useEffect(() => {
    // Track homepage visit
    dispatch(setVisitMetrics({
      visitTimestamp: new Date().toISOString(),
      referralSource: document.referrer || null,
    }));
  }, [dispatch]);

  const handleStartAssessment = () => {
    dispatch(updateJourneyStep('questionnaire'));
    navigate('/PersonalHealth&ServiceInterest');
  };

  return (
    <div className="homepage-container">
      <section className="core-features-section">
        <CoreFeaturesHero />
        <CoreFeaturesBenefits />
      </section>
      <section className="original-homepage-section">
        <HeroSection onCTAClick={handleStartAssessment} />
        <BenefitsSection />
        <ProcessSection currentStep={userJourney.currentStep} />
        <FooterCTA onCTAClick={handleStartAssessment} />
      </section>
    </div>
  );
};

export default Homepage;
