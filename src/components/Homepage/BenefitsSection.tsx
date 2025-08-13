import React from 'react';

const BenefitCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="benefit-card">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const BenefitsSection: React.FC = () => {
  return (
    <section className="benefits-section">
      <h2>How It Works</h2>
      <div className="benefits-grid">
        <BenefitCard
          title="Health Assessment"
          description="Complete our comprehensive health questionnaire to get a baseline of your current health status."
        />
        <BenefitCard
          title="Lab Integration"
          description="Upload your existing lab results or order new tests through our integrated partners."
        />
        <BenefitCard
          title="Personalized Recommendations"
          description="Receive a personalized health plan with supplement and lifestyle recommendations."
        />
      </div>
    </section>
  );
};

export default BenefitsSection;
