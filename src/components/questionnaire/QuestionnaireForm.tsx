import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuestionnaireByIdQuery, useSubmitQuestionnaireResponseMutation } from '../../service/QuestionnaireService';
import QuestionPage from './QuestionPage';
import ProgressIndicator from './ProgressIndicator';
import type { IQuestionResponseRequest } from '../../models/IQuestionnaireResponse';
import { toastSuccess, toastError, toastWarning } from '../../utils/ToastUtils';

/**
 * QuestionnaireForm Component
 * 
 * Main form component for completing questionnaires:
 * - Multi-page questionnaire navigation
 * - Progress tracking
 * - Auto-save functionality
 * - Validation and error handling
 * - Conditional question logic
 */
const QuestionnaireForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Map<string, IQuestionResponseRequest>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const { 
    data: questionnaire, 
    isLoading, 
    error 
  } = useGetQuestionnaireByIdQuery(id || '');

  const [submitResponse] = useSubmitQuestionnaireResponseMutation();

  const handleQuestionResponse = useCallback((questionId: string, response: IQuestionResponseRequest) => {
    setResponses(prev => new Map(prev.set(questionId, response)));
  }, []);

  // Validate if current page has all required questions answered
  const validateCurrentPage = (): boolean => {
    if (!questionnaire) return false;
    
    const currentPageData = questionnaire.data.pages[currentPage];
    const requiredQuestions = currentPageData.questions.filter(q => q.isRequired);
    
    for (const question of requiredQuestions) {
      const response = responses.get(question.id);
      if (!response || response.isSkipped || response.answerValue == null || (typeof response.answerValue === 'string' && response.answerValue.trim() === '')) {
        return false;
      }
    }
    
    return true;
  };

  const validateAllPages = (): { isValid: boolean; firstInvalidPage?: number } => {
    if (!questionnaire) return { isValid: false };

    for (let i = 0; i < questionnaire.data.pages.length; i++) {
      const page = questionnaire.data.pages[i];
      const requiredQuestions = page.questions.filter(q => q.isRequired);

      for (const question of requiredQuestions) {
        const response = responses.get(question.id);
        if (!response || response.isSkipped || response.answerValue == null || (typeof response.answerValue === 'string' && response.answerValue.trim() === '')) {
          return { isValid: false, firstInvalidPage: i };
        }
      }
    }

    return { isValid: true };
  };

  const handleNextPage = () => {
    if (!questionnaire || currentPage >= questionnaire.data.pages.length - 1) return;
    
    // Validate current page before proceeding
    if (!validateCurrentPage()) {
      toastWarning('Please answer all required questions before proceeding to the next page.');
      return;
    }
    
    setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!questionnaire || !id) return;

    // Final validation before submission
    const { isValid, firstInvalidPage } = validateAllPages();
    if (!isValid) {
      toastWarning('Please answer all required questions before submitting.');
      if (firstInvalidPage !== undefined) {
        setCurrentPage(firstInvalidPage);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedResponses = Array.from(responses.values()).map(r => ({
        ...r,
        answerValue: Array.isArray(r.answerValue) ? r.answerValue.join(', ') : r.answerValue,
      }));

      const responseData = {
        questionnaireId: id,
        responses: formattedResponses,
        isCompleted: true
      };

      await submitResponse(responseData).unwrap();
      toastSuccess('Questionnaire submitted successfully!');
      navigate('/questionnaires/results');
    } catch (error) {
      console.error('Failed to submit questionnaire:', error);
      toastError('Failed to submit questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!questionnaire || !id) return;

    setIsSavingDraft(true);
    try {
      const responseData = {
        questionnaireId: id,
        responses: Array.from(responses.values()),
        isCompleted: false
      };

      await submitResponse(responseData).unwrap();
      toastSuccess('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      toastError('Failed to save draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading questionnaire...</div>;
  }

  if (error || !questionnaire) {
    return <div className="error">Questionnaire not found</div>;
  }

  const currentPageData = questionnaire.data.pages[currentPage];
  const totalPages = questionnaire.data.pages.length;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <div className="questionnaire-form-container">
      <div className="questionnaire-form-header">
        <h1>{questionnaire.data.title}</h1>
        <ProgressIndicator 
          currentPage={currentPage + 1} 
          totalPages={totalPages}
          percentage={(currentPage / totalPages) * 100}
        />
      </div>

      <div className="questionnaire-form-content">
        <QuestionPage
          page={currentPageData}
          responses={responses}
          onQuestionResponse={handleQuestionResponse}
        />
      </div>

      <div className="questionnaire-form-actions">
        <div className="navigation-buttons">
          <button 
            className="btn btn-secondary"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          
          {!isLastPage ? (
            <button 
              className="btn btn-primary"
              onClick={handleNextPage}
            >
              Next
            </button>
          ) : (
            <button 
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
            </button>
          )}
        </div>

        <button 
          className="btn btn-outline save-draft-btn"
          onClick={handleSaveDraft}
          disabled={isSavingDraft}
        >
          {isSavingDraft ? 'Saving...' : 'Save Draft'}
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
