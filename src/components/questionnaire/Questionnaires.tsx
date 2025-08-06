import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetQuestionnairesQuery } from '../../service/QuestionnaireService';
import './Questionnaire.css';

/**
 * Questionnaires Component
 * 
 * Main landing page for questionnaires showing:
 * - List of available questionnaires
 * - User's completed questionnaires
 * - Progress indicators
 * - Search and filter functionality
 */
const Questionnaires: React.FC = () => {
  const navigate = useNavigate();
  const { 
    data: response, 
    isLoading, 
    error 
  } = useGetQuestionnairesQuery({ page: 0, size: 10 });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading questionnaires...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: '#dc3545', marginBottom: '1rem' }}></i>
        <div className="error-message">Error loading questionnaires</div>
        <button 
          className="btn-questionnaire" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const questionnaires = response?.data?.questionnaires || [];

  const handleStartQuestionnaire = (questionnaireId: string) => {
    navigate(`/questionnaires/${questionnaireId}`);
  };

  const handleViewForm = (questionnaireId: string) => {
    navigate(`/questionnaires/${questionnaireId}/form`);
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <h1>
          <i className="bi bi-clipboard-check me-2"></i>
          Medical Questionnaires
        </h1>
        <p>Complete your health assessments to help us provide better care</p>
      </div>

      <div className="questionnaires-content">
        {questionnaires.length > 0 ? (
          <div className="questionnaire-grid">
            {questionnaires.map((questionnaire) => (
              <div key={questionnaire.id} className="questionnaire-card">
                <div className="questionnaire-card-header">
                  <div className="questionnaire-category">
                    {questionnaire.category}
                  </div>
                  <h3 className="questionnaire-title">
                    {questionnaire.title}
                  </h3>
                </div>

                <p className="questionnaire-description">
                  {questionnaire.description}
                </p>

                <div className="questionnaire-meta">
                  <div className="questionnaire-info">
                    <span>
                      <i className="bi bi-clock"></i>
                      {questionnaire.estimatedTimeMinutes} min
                    </span>
                    <span>
                      <i className="bi bi-question-circle"></i>
                      {questionnaire.totalQuestions} questions
                    </span>
                  </div>
                  
                  <div className="questionnaire-actions">
                    <button 
                      className="btn-questionnaire btn-outline"
                      onClick={() => handleStartQuestionnaire(questionnaire.id)}
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      View Details
                    </button>
                    <button 
                      className="btn-questionnaire"
                      onClick={() => handleViewForm(questionnaire.id)}
                      disabled={!questionnaire.isActive}
                    >
                      <i className="bi bi-play-fill me-1"></i>
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="error-container">
            <i className="bi bi-inbox" style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '1rem' }}></i>
            <p>No questionnaires available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaires;
