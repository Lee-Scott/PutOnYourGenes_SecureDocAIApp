import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetQuestionnairesQuery, useGetUserResponsesQuery } from '../../service/QuestionnaireService';
import { IQuestionnaire } from '../../models/IQuestionnaire';
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
  const [activeTab, setActiveTab] = useState('available');

  const { 
    data: response, 
    isLoading: isLoadingQuestionnaires, 
    error: errorQuestionnaires 
  } = useGetQuestionnairesQuery({ page: 0, size: 10 });

  const {
    data: userResponses,
    isLoading: isLoadingUserResponses,
    error: errorUserResponses,
  } = useGetUserResponsesQuery();

  const isLoading = isLoadingQuestionnaires || isLoadingUserResponses;
  const error = errorQuestionnaires || errorUserResponses;

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

  const handleViewResults = (responseId: string) => {
    navigate(`/questionnaires/results/${responseId}`);
  };

  const handleCreateNew = () => {
    navigate('/questionnaires/builder');
  };

  const renderAvailableQuestionnaires = () => (
    <div className="questionnaire-grid">
      {questionnaires.map((questionnaire: IQuestionnaire) => (
        <div key={questionnaire.id} className="questionnaire-card">
          <div className="questionnaire-card-header">
            <div className="questionnaire-category">{questionnaire.category}</div>
            <h3 className="questionnaire-title">{questionnaire.title}</h3>
          </div>
          <p className="questionnaire-description">{questionnaire.description}</p>
          <div className="questionnaire-meta">
            <div className="questionnaire-info">
              <span><i className="bi bi-clock"></i> {questionnaire.estimatedTimeMinutes} min</span>
              <span><i className="bi bi-question-circle"></i> {questionnaire.totalQuestions} questions</span>
            </div>
            <div className="questionnaire-actions">
              <button className="btn-questionnaire btn-outline" onClick={() => handleStartQuestionnaire(questionnaire.id)}>
                <i className="bi bi-info-circle me-1"></i> View Details
              </button>
              <button className="btn-questionnaire" onClick={() => handleViewForm(questionnaire.id)} disabled={!questionnaire.isActive}>
                <i className="bi bi-play-fill me-1"></i> Start
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompletedQuestionnaires = () => (
    <div className="questionnaire-grid">
      {userResponses?.data?.map((response) => {
        const questionnaire = questionnaires.find((q: IQuestionnaire) => q.id === response.questionnaireId);
        return (
          <div key={response.id} className="questionnaire-card">
            <div className="questionnaire-card-header">
              <h3 className="questionnaire-title">{questionnaire ? questionnaire.title : 'Completed Questionnaire'}</h3>
            </div>
            <p className="questionnaire-description">
              Completed on: {response.completedAt ? new Date(response.completedAt).toLocaleDateString() : 'N/A'}
            </p>
            <div className="questionnaire-actions">
              <button className="btn-questionnaire" onClick={() => handleViewResults(response.id)}>
                <i className="bi bi-eye-fill me-1"></i> View Results
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <div>
          <h1>
            <i className="bi bi-clipboard-check me-2"></i>
            Medical Questionnaires
          </h1>
          <p>Complete your health assessments to help us provide better care</p>
        </div>
        <button className="btn-questionnaire" onClick={handleCreateNew}>
          <i className="bi bi-plus-circle-fill me-1"></i> Create New
        </button>
      </div>

      <div className="questionnaire-tabs">
        <button className={`tab-button ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
          Available
        </button>
        <button className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
          Completed
        </button>
      </div>

      <div className="questionnaires-content">
        {activeTab === 'available' && (questionnaires.length > 0 ? renderAvailableQuestionnaires() : <p>No questionnaires available at this time.</p>)}
        {activeTab === 'completed' && (userResponses?.data && userResponses.data.length > 0 ? renderCompletedQuestionnaires() : <p>No completed questionnaires.</p>)}
      </div>
    </div>
  );
};

export default Questionnaires;
