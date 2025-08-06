import React from 'react';
import { useGetUserResponsesQuery } from '../../service/QuestionnaireService';

/**
 * QuestionnaireResults Component
 * 
 * Shows completed questionnaire results and analytics:
 * - User's questionnaire responses
 * - Score calculations and interpretations
 * - Recommendations based on responses
 * - Options to retake or share results
 * - Export/download functionality
 */
const QuestionnaireResults: React.FC = () => {
  const { 
    data: userResponses, 
    isLoading, 
    error 
  } = useGetUserResponsesQuery();

  if (isLoading) {
    return <div className="loading">Loading your results...</div>;
  }

  if (error) {
    return <div className="error">Error loading results</div>;
  }

  return (
    <div className="questionnaire-results-container">
      <div className="results-header">
        <h1>Your Questionnaire Results</h1>
        <p>Review your completed health assessments and recommendations</p>
      </div>

      <div className="results-content">
        <div className="results-summary">
          <h2>Results Summary</h2>
          {/* TODO: Implement results summary */}
          <div className="summary-cards">
            {/* Summary cards will go here */}
          </div>
        </div>

        <div className="detailed-results">
          <h2>Detailed Results</h2>
          {userResponses?.data && userResponses.data.length > 0 ? (
            <div className="results-list">
              {userResponses.data.map((response) => (
                <div key={response.id} className="result-item">
                  <h3>Questionnaire Response</h3>
                  <p>Completed: {new Date(response.completedAt || '').toLocaleDateString()}</p>
                  <p>Score: {response.totalScore || 'N/A'}</p>
                  {/* TODO: Add more detailed result display */}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No completed questionnaires found.</p>
              <button className="btn btn-primary">
                Take Your First Questionnaire
              </button>
            </div>
          )}
        </div>

        <div className="recommendations">
          <h2>Recommendations</h2>
          {/* TODO: Implement recommendations based on results */}
          <div className="recommendation-cards">
            {/* Recommendation cards will go here */}
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-secondary">
            Download Results (PDF)
          </button>
          <button className="btn btn-outline">
            Share with Provider
          </button>
          <button className="btn btn-primary">
            Take Another Questionnaire
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireResults;
