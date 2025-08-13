import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setVisitMetrics, updateJourneyStep } from '../../store/slices/homepageSlice';
import { RootState } from '../../store/store';
import { useGetQuestionnairesQuery } from '../../service/QuestionnaireService';
import HeroSection from './HeroSection';
import BenefitsSection from './BenefitsSection';
import ProcessSection from './ProcessSection';
import FooterCTA from './FooterCTA';
import './Homepage.css';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userJourney } = useSelector((state: RootState) => state.homepage);
  const { data: questionnairesData, isSuccess } = useGetQuestionnairesQuery({ page: 0, size: 1 });

  useEffect(() => {
    // Track homepage visit
    dispatch(setVisitMetrics({
      visitTimestamp: new Date().toISOString(),
      referralSource: document.referrer || null,
    }));
  }, [dispatch]);

  const handleStartAssessment = () => {
    if (isSuccess && questionnairesData?.data.questionnaires.length > 0) {
      const questionnaireId = questionnairesData.data.questionnaires[0].id;
      dispatch(updateJourneyStep('questionnaire'));
      navigate(`/questionnaires/${questionnaireId}/form`);
    }
  };

  return (
    <div className="homepage-container">
      <HeroSection onCTAClick={handleStartAssessment} />
      <BenefitsSection />
      <ProcessSection currentStep={userJourney.currentStep} />
      <FooterCTA onCTAClick={handleStartAssessment} />
    </div>
  );
};

export default Homepage;
