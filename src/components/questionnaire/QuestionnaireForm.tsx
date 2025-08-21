import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuestionnaireByIdQuery, useSubmitQuestionnaireResponseMutation } from '../../service/QuestionnaireService';
import QuestionPage from './QuestionPage';
import ProgressIndicator from './ProgressIndicator';
import type { IQuestionResponseRequest } from '../../models/IQuestionnaireResponse';
import { toastSuccess, toastError, toastWarning } from '../../utils/ToastUtils';
import { useDispatch } from 'react-redux';
import { setSelectedIntegrations } from '../../store/slices/integrationSlice';
import personalHealthQuestionnaire from '../../data/personalHealthQuestionnaire.json';
import { IQuestionnaire, IQuestionPage } from '../../models/IQuestionnaire';
import { IQuestion } from '../../models/IQuestion';

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
  const dispatch = useDispatch();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Map<string, IQuestionResponseRequest>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const personalHealthQuestionnaireId = '488d2107-24e5-5d05-a471-c64b9091685f';
  const isPersonalHealthQuestionnaire = window.location.pathname.endsWith('/PersonalHealth&ServiceInterest') || id === personalHealthQuestionnaireId;

  const { 
    data: fetchedQuestionnaire, 
    isLoading, 
    error 
  } = useGetQuestionnaireByIdQuery(id || '', { skip: isPersonalHealthQuestionnaire });

  const [questionnaire, setQuestionnaire] = useState<IQuestionnaire | undefined>();

  useEffect(() => {
    if (isPersonalHealthQuestionnaire) {
      setQuestionnaire(personalHealthQuestionnaire as IQuestionnaire);
    } else if (fetchedQuestionnaire) {
      setQuestionnaire(fetchedQuestionnaire.data);
    }
  }, [isPersonalHealthQuestionnaire, fetchedQuestionnaire]);

  const [submitResponse] = useSubmitQuestionnaireResponseMutation();

  const handleQuestionResponse = useCallback((questionId: string, response: IQuestionResponseRequest) => {
    setResponses(prev => new Map(prev.set(questionId, response)));
  }, []);

  // Validate if current page has all required questions answered
  const validateCurrentPage = (): boolean => {
    if (!questionnaire) return false;
    
    const currentPageData = questionnaire.pages[currentPage];
    const requiredQuestions = currentPageData.questions.filter((q) => q.isRequired);
    
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

    for (let i = 0; i < questionnaire.pages.length; i++) {
      const page = questionnaire.pages[i];
      const requiredQuestions = page.questions.filter((q) => q.isRequired);

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
    if (!questionnaire || currentPage >= questionnaire.pages.length - 1) return;
    
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
    if (!questionnaire) return;
    const questionnaireIdToSubmit = id || personalHealthQuestionnaireId;

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
        questionnaireId: questionnaireIdToSubmit,
        responses: formattedResponses,
        isCompleted: true
      };

      const result = await submitResponse(responseData).unwrap();
      toastSuccess('Questionnaire submitted successfully!');

      if (isPersonalHealthQuestionnaire) {
        const serviceInterestPage = questionnaire.pages.find((p: IQuestionPage) => p.title === 'Service Interest');
        if (serviceInterestPage) {
          const interestedIntegrations = serviceInterestPage.questions
            .filter((q: IQuestion) => responses.get(q.id)?.answerValue === 'interested')
            .flatMap((q: IQuestion) => q.questionText.split(':'));
          dispatch(setSelectedIntegrations(interestedIntegrations));
        }
        
        const uploadQuestion = questionnaire.pages.flatMap((p: IQuestionPage) => p.questions).find((q: IQuestion) => q.questionText.includes('upload'));
        if (uploadQuestion && responses.get(uploadQuestion.id)?.answerValue === 'Yes') {
          navigate('/documents');
        } else {
          navigate('/integrations');
        }
      } else {
        navigate(`/questionnaires/results/${result.data.id}`);
      }
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

  const currentPageData = questionnaire.pages[currentPage];
  const totalPages = questionnaire.pages.length;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <div className="questionnaire-form-container">
      <div className="questionnaire-form-header">
        <h1>{questionnaire.title}</h1>
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
