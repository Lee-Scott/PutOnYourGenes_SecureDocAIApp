import React from 'react';

interface ProcessSectionProps {
  currentStep: 'landing' | 'questionnaire' | 'upload' | 'results';
}

const ProcessStep: React.FC<{ step: number; title: string; description: string; isActive: boolean }> = ({ step, title, description, isActive }) => (
  <div className={`process-step ${isActive ? 'active' : ''}`}>
    <div className="step-number">{step}</div>
    <div className="step-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const ProcessSection: React.FC<ProcessSectionProps> = ({ currentStep }) => {
  const steps = [
    { id: 'questionnaire', title: 'Complete Assessment', description: 'Fill out our detailed health questionnaire.' },
    { id: 'upload', title: 'Upload Lab Results', description: 'Upload your existing lab results for analysis.' },
    { id: 'results', title: 'Get Recommendations', description: 'Receive your personalized health plan.' },
  ];

  return (
    <section className="process-section">
      <h2>Your Journey to Better Health</h2>
      <div className="process-steps">
        {steps.map((step, index) => (
          <ProcessStep
            key={step.id}
            step={index + 1}
            title={step.title}
            description={step.description}
            isActive={currentStep === step.id}
          />
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
