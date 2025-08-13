import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuestionnaireResponseQuery } from '../../service/QuestionnaireService';
import { useDeleteQuestionnaireResponseMutation } from '../../service/QuestionnaireService';
import { useCreateChatRoomMutation } from '../../service/ChatRoomService';
import { useGetUsersQuery, useFetchUserQuery } from '../../service/UserService';
import { toastSuccess, toastError, toastInfo } from '../../utils/ToastUtils';
import { generateQuestionnaireResultsPDF } from '../../utils/PDFUtils';
import type { IQuestionnaireResponse, ICategoryScore } from '../../models/IQuestionnaireResponse';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

/**
 * QuestionnaireResults Component
 * 
 * Shows completed questionnaire results and analytics:
 * - User's questionnaire responses with summary cards
 * - Score calculations and interpretations
 * - Health recommendations based on response patterns
 * - Options to retake, share, or export results
 * - Email and messaging functionality for sharing with providers
 */

interface ResultsSummaryProps {
  response: IQuestionnaireResponse;
}

interface RecommendationCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const QuestionnaireResults: React.FC = () => {
  const { responseId } = useParams<{ responseId: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useFetchUserQuery();
  const isAuthenticated = !!user;
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowPaywall(true);
      }, 5000); // Show paywall after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const { 
    data: userResponses, 
    isLoading, 
    error 
  } = useGetQuestionnaireResponseQuery(responseId as string, {
    skip: !responseId,
  });

  const [deleteQuestionnaireResponse] = useDeleteQuestionnaireResponseMutation();
  const { data: currentUserResponse } = useFetchUserQuery();
  const [createChatRoom] = useCreateChatRoomMutation();
  const [selectedResponse, setSelectedResponse] = useState<IQuestionnaireResponse | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);

  // Helper function to generate results summary
  const generateResultsSummary = (response: IQuestionnaireResponse) => {
    const completionDate = new Date(response.completedAt || '').toLocaleDateString();
    const totalQuestions = response.responses?.length || 0;
    const answeredQuestions = response.responses?.filter(r => !r.isSkipped).length || 0;
    const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return {
      completionDate,
      totalQuestions,
      answeredQuestions,
      completionRate,
      totalScore: response.totalScore || 0,
      categoryScores: response.categoryScores || []
    };
  };

  // Helper function to generate health recommendations
  const generateRecommendations = (response: IQuestionnaireResponse): RecommendationCardProps[] => {
    const recommendations: RecommendationCardProps[] = [];
    const totalScore = response.totalScore || 0;
    const categoryScores = response.categoryScores || [];

    // Generate recommendations based on total score
    if (totalScore < 30) {
      recommendations.push({
        title: "Immediate Health Assessment Recommended",
        description: "Your responses indicate areas that may benefit from professional medical evaluation. Consider scheduling an appointment with your healthcare provider.",
        priority: 'high',
        category: 'Medical Care'
      });
    } else if (totalScore < 60) {
      recommendations.push({
        title: "Preventive Care Focus",
        description: "Consider implementing preventive health measures and lifestyle modifications to improve your overall wellness.",
        priority: 'medium',
        category: 'Prevention'
      });
    } else {
      recommendations.push({
        title: "Maintain Healthy Habits",
        description: "Your responses suggest good health awareness. Continue with your current health practices and regular check-ups.",
        priority: 'low',
        category: 'Maintenance'
      });
    }

    // Generate category-specific recommendations
    categoryScores.forEach(category => {
      if (category.percentage < 40) {
        recommendations.push({
          title: `${category.category} Attention Needed`,
          description: `Your ${category.category.toLowerCase()} scores suggest this area may need focused attention and potential professional guidance.`,
          priority: 'high',
          category: category.category
        });
      } else if (category.percentage < 70) {
        recommendations.push({
          title: `${category.category} Improvement Opportunity`,
          description: `Consider strategies to enhance your ${category.category.toLowerCase()} wellness through lifestyle changes or professional consultation.`,
          priority: 'medium',
          category: category.category
        });
      }
    });

    // Add general wellness recommendations
    recommendations.push({
      title: "Regular Health Monitoring",
      description: "Continue monitoring your health by completing questionnaires periodically to track changes and improvements.",
      priority: 'low',
      category: 'Monitoring'
    });

    return recommendations;
  };

  // Email functionality
  const handleEmailResults = (response: IQuestionnaireResponse) => {
    const summary = generateResultsSummary(response);
    const recommendations = generateRecommendations(response);
    
    const emailBody = encodeURIComponent(`
Health Questionnaire Results Summary

Completion Date: ${summary.completionDate}
Total Score: ${summary.totalScore}
Completion Rate: ${summary.completionRate}%

Category Breakdown:
${summary.categoryScores.map(cat => `${cat.category}: ${cat.score}/${cat.maxScore} (${cat.percentage}%)`).join('\n')}

Key Recommendations:
${recommendations.slice(0, 3).map(rec => `• ${rec.title}: ${rec.description}`).join('\n')}

This summary was generated from your health questionnaire responses. Please consult with your healthcare provider for professional medical advice.
    `);

    const mailtoLink = `mailto:?subject=Health Questionnaire Results&body=${emailBody}`;
    window.open(mailtoLink, '_blank');
    toastSuccess('Email client opened with your results');
  };

  // Messaging functionality
  const handleShareWithProvider = async (response: IQuestionnaireResponse) => {
    try {
      setSelectedResponse(response);
      setShowProviderModal(true);
    } catch (error) {
      console.error('Failed to open provider selection:', error);
      toastError('Failed to open provider selection. Please try again.');
    }
  };

  // Create chat room with selected provider and share results
  const handleSelectProvider = async (providerId: string) => {
    if (!currentUserResponse?.data) {
      toastError('Could not identify current user to create chat.');
      return;
    }

    try {
      toastInfo('Creating chat room with healthcare provider...');
      const result = await createChatRoom({
        user1: { userId: currentUserResponse.data.user.userId },
        user2: { userId: providerId },
      }).unwrap();

      if (result && result.data && result.data.chatRoom.chatRoomId) {
        toastSuccess('Chat room created successfully!');
        window.location.href = `/chat/${result.data.chatRoom.chatRoomId}`;
      } else {
        throw new Error('Failed to create chat room or get its ID.');
      }
    } catch (error) {
      console.error('Failed to create chat room:', error);
      toastError('Failed to create chat room. The chat may already exist or another error occurred.');
    }
  };

  // Export to PDF
  const handleExportPDF = async (response: IQuestionnaireResponse) => {
    try {
      toastInfo('Generating PDF report...');
      
      await generateQuestionnaireResultsPDF(response, {
        includeRecommendations: true,
        includeCategoryBreakdown: true,
        headerInfo: {
          patientName: 'Patient', // This could be pulled from user context
          providerId: undefined,
          clinicName: 'SecureDocAI Health Platform'
        }
      });
      
      toastSuccess('PDF report generated and downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toastError('Failed to generate PDF report. Please try again.');
    }
  };

  const handleDeleteQuestionnaire = async () => {
    if (userResponses?.data && window.confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      try {
        await deleteQuestionnaireResponse(userResponses.data.questionnaireId).unwrap();
        toastSuccess('Questionnaire deleted successfully.');
        navigate('/questionnaires');
      } catch (error) {
        toastError('Failed to delete questionnaire.');
      }
    }
  };

  if (isLoading || isUserLoading) {
    return <div className="loading">Loading your results...</div>;
  }

  if (error) {
    return <div className="error">Error loading results</div>;
  }

  // Results Summary Component
  const ResultsSummary: React.FC<ResultsSummaryProps> = ({ response }) => {
    const summary = generateResultsSummary(response);
    
    return (
      <div className="summary-cards">
        <div className="summary-card summary-card--primary">
          <h3>Overall Score</h3>
          <div className="score-display">
            <span className="score-number">{summary.totalScore}</span>
            <div className="score-progress">
              <div 
                className="score-progress-bar" 
                style={{ width: `${Math.min(summary.totalScore, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h3>Completion</h3>
          <p className="completion-rate">{summary.completionRate}%</p>
          <p className="completion-detail">
            {summary.answeredQuestions} of {summary.totalQuestions} questions
          </p>
        </div>

        <div className="summary-card">
          <h3>Completed</h3>
          <p className="completion-date">{summary.completionDate}</p>
        </div>

        {summary.categoryScores.length > 0 && (
          <div className="summary-card summary-card--categories">
            <h3>Category Scores</h3>
            <div className="category-scores">
              {summary.categoryScores.map((category) => (
                <div key={category.category} className="category-score">
                  <span className="category-name">{category.category}</span>
                  <div className="category-progress">
                    <div 
                      className="category-progress-bar" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="category-percentage">{category.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Recommendation Card Component
  const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, description, priority, category }) => {
    const priorityClass = `recommendation-card--${priority}`;
    
    return (
      <div className={`recommendation-card ${priorityClass}`}>
        <div className="recommendation-header">
          <h4>{title}</h4>
          <span className={`priority-badge priority-badge--${priority}`}>
            {priority.toUpperCase()}
          </span>
        </div>
        <p className="recommendation-description">{description}</p>
        <div className="recommendation-footer">
          <span className="recommendation-category">{category}</span>
        </div>
      </div>
    );
  };

  // Healthcare Provider Selection Modal
  const ProviderSelectionModal: React.FC = () => {
    const { data: usersResponse, isLoading: loadingProviders, error: providersError } = useGetUsersQuery();

    const providers = usersResponse?.data?.users?.filter((user: any) => user.role === 'DOCTOR') || [];

    if (!showProviderModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowProviderModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Select Healthcare Provider</h3>
            <button 
              className="modal-close" 
              onClick={() => setShowProviderModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <p>Choose a healthcare provider to share your questionnaire results with:</p>
            
            {loadingProviders ? (
              <div className="loading">Loading healthcare providers...</div>
            ) : (
              <div className="provider-list">
                {providers.map((provider: any) => (
                  <div 
                    key={provider.userId}
                    className={`provider-item`}
                  >
                    <div className="provider-info">
                      <h4>{provider.firstName} {provider.lastName}</h4>
                      <p className="provider-email">{provider.email}</p>
                      <span className={`provider-status available`}>
                        ● Available
                      </span>
                    </div>
                    
                    <button
                      className={`btn btn-primary`}
                      onClick={() => {
                        handleSelectProvider(provider.userId);
                        setShowProviderModal(false);
                      }}
                    >
                      Select
                    </button>
                  </div>
                ))}

                {(!providers || providers.length === 0) && !loadingProviders && (
                  <div className="no-providers">
                    <p>No healthcare providers available at the moment.</p>
                    <p>Please try again later or contact support.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn btn-outline" 
              onClick={() => setShowProviderModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className={`questionnaire-results-container ${showPaywall ? 'blurred' : ''}`}>
        {showPaywall && (
          <div className="auth-prompt">
            <h2>See Your Full Results</h2>
            <p>Create an account or log in to view your detailed health recommendations and full results.</p>
            <div className="auth-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-secondary" onClick={() => navigate('/register')}>Sign Up</button>
            </div>
          </div>
        )}
        <div className="results-header">
          <h1>Your Questionnaire Results</h1>
          <p>Review your completed health assessments and recommendations</p>
        </div>
        <div className="results-content">
          <div className="results-summary">
            <h2>Results Summary</h2>
            {userResponses?.data ? (
              <ResultsSummary response={userResponses.data} />
            ) : (
              <div className="no-summary">
                <p>No completed questionnaires available for summary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
          {userResponses?.data ? (
            <ResultsSummary response={userResponses.data} />
          ) : (
            <div className="no-summary">
              <p>No completed questionnaires available for summary.</p>
            </div>
          )}
        </div>

        <div className="detailed-results">
          <h2>Detailed Results</h2>
          {userResponses?.data ? (
            <div className="results-list">
              <div className="result-item">
                <div className="result-item-header">
                  <h3>Health Assessment</h3>
                  <span className="result-date">
                    {new Date(userResponses.data.completedAt || '').toLocaleDateString()}
                  </span>
                </div>
                <div className="result-item-content">
                  {/* ... content ... */}
                </div>
                <div className="result-item-actions">
                  <button className="btn btn-outline btn-small" onClick={() => handleEmailResults(userResponses.data!)}>
                    📧 Email
                  </button>
                  <button className="btn btn-outline btn-small" onClick={() => handleShareWithProvider(userResponses.data!)}>
                    💬 Message Provider
                  </button>
                  <button className="btn btn-outline btn-small" onClick={() => handleExportPDF(userResponses.data!)}>
                    📄 Export PDF
                  </button>
                  <button className="btn btn-danger btn-small" onClick={handleDeleteQuestionnaire}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-results">
              <p>No completed questionnaires found.</p>
            </div>
          )}
        </div>

        <div className="recommendations">
          <h2>Health Recommendations</h2>
          {userResponses?.data ? (
            <div className="recommendation-cards">
              {generateRecommendations(userResponses.data).map((recommendation, index) => (
                <RecommendationCard
                  key={index}
                  title={recommendation.title}
                  description={recommendation.description}
                  priority={recommendation.priority}
                  category={recommendation.category}
                />
              ))}
            </div>
          ) : (
            <div className="no-recommendations">
              <p>Complete a questionnaire to receive personalized health recommendations.</p>
            </div>
          )}
        </div>

        <div className="actions">
          <div className="primary-actions">
            <button className="btn btn-primary">
              Take Another Questionnaire
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => userResponses?.data && handleEmailResults(userResponses.data)}
              disabled={!userResponses?.data}
            >
              📧 Email Results
            </button>
          </div>
          
          <div className="secondary-actions">
            <button 
              className="btn btn-outline"
              onClick={() => userResponses?.data && handleShareWithProvider(userResponses.data)}
              disabled={!userResponses?.data}
            >
              💬 Message Healthcare Provider
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => userResponses?.data && handleExportPDF(userResponses.data)}
              disabled={!userResponses?.data}
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Provider Selection Modal */}
      <ProviderSelectionModal />
    </div>
  );
};

export default QuestionnaireResults;
