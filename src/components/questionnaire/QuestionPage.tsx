import React from 'react';
import QuestionItem from './QuestionItem';
import type { IQuestionPage } from '../../models/IQuestionnaire';
import type { IQuestionResponseRequest } from '../../models/IQuestionnaireResponse';
import './Questionnaire.css';

interface QuestionPageProps {
  page: IQuestionPage;
  responses: Map<string, IQuestionResponseRequest>;
  onQuestionResponse: (questionId: string, response: IQuestionResponseRequest) => void;
}

/**
 * QuestionPage Component
 * 
 * Renders a single page of questions within a questionnaire:
 * - Page title and description
 * - List of questions for the current page
 * - Conditional question logic
 * - Validation feedback
 */
const QuestionPage: React.FC<QuestionPageProps> = ({
  page,
  responses,
  onQuestionResponse
}) => {
  return (
    <div className="question-page-container">
      <div className="question-page-header">
        <h2>{page.title}</h2>
        {page.description && (
          <p className="page-description">{page.description}</p>
        )}
      </div>

      <div className="questions-list">
        {page.questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            response={responses.get(question.id)}
            onResponse={(response: IQuestionResponseRequest) => onQuestionResponse(question.id, response)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionPage;
