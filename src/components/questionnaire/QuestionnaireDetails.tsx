import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetQuestionnaireByIdQuery } from '../../service/QuestionnaireService';

/**
 * QuestionnaireDetails Component
 * 
 * Shows detailed information about a questionnaire before starting:
 * - Questionnaire title and description
 * - Estimated completion time
 * - Number of questions/pages
 * - Privacy and data usage information
 * - Start questionnaire button
 */
const QuestionnaireDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { 
    data: questionnaire, 
    isLoading, 
    error 
  } = useGetQuestionnaireByIdQuery(id || '');

  if (isLoading) {
    return <div className="loading">Loading questionnaire details...</div>;
  }

  if (error || !questionnaire) {
    return <div className="error">Questionnaire not found</div>;
  }

  const handleStartQuestionnaire = () => {
    // TODO: Navigate to questionnaire form
    console.log('Starting questionnaire:', id);
  };

  return (
    <div className="questionnaire-details-container">
      <div className="questionnaire-details-header">
        <h1>{questionnaire.data.title}</h1>
        <div className="questionnaire-meta">
          <span className="category">{questionnaire.data.category}</span>
          <span className="duration">~{questionnaire.data.estimatedTimeMinutes} minutes</span>
          <span className="questions">{questionnaire.data.totalQuestions} questions</span>
        </div>
      </div>

      <div className="questionnaire-details-content">
        <div className="description">
          <h2>About This Questionnaire</h2>
          <p>{questionnaire.data.description}</p>
        </div>

        <div className="privacy-info">
          <h3>Privacy & Data Usage</h3>
          <ul>
            <li>Your responses are securely encrypted and stored</li>
            <li>Only authorized healthcare providers can access your data</li>
            <li>You can review and update your responses at any time</li>
            <li>Data is used solely for improving your healthcare experience</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            className="btn btn-primary start-btn"
            onClick={handleStartQuestionnaire}
          >
            Start Questionnaire
          </button>
          <button className="btn btn-secondary back-btn">
            Back to Questionnaires
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireDetails;
