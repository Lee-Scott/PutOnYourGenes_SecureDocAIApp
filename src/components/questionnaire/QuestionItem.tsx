import React, { useState, useEffect } from 'react';
import type { IQuestion } from '../../models/IQuestion';
import type { IQuestionResponseRequest } from '../../models/IQuestionnaireResponse';

interface QuestionItemProps {
  question: IQuestion;
  response?: IQuestionResponseRequest;
  onResponse: (response: IQuestionResponseRequest) => void;
}

/**
 * QuestionItem Component
 * 
 * Renders individual questions with appropriate input controls:
 * - Multiple choice questions (radio buttons)
 * - Single choice questions (dropdown)
 * - Text input questions
 * - Number input questions
 * - Date picker questions
 * - Scale/rating questions
 * - Yes/No questions
 * - Checkbox questions
 */
const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  response,
  onResponse
}) => {
  const [localValue, setLocalValue] = useState<string | number | boolean | string[]>('');
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (response) {
      setLocalValue(response.answerValue);
      setIsSkipped(response.isSkipped);
    }
  }, [response]);

  const handleValueChange = (value: string | number | boolean | string[]) => {
    setLocalValue(value);
    setIsSkipped(false);
    
    onResponse({
      questionId: question.id,
      answerValue: value,
      answerText: typeof value === 'string' ? value : undefined,
      isSkipped: false
    });
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setLocalValue('');
    
    onResponse({
      questionId: question.id,
      answerValue: '',
      isSkipped: true
    });
  };

  const renderQuestionInput = () => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
      case 'SINGLE_CHOICE':
        return (
          <div className="question-options">
            {question.options?.map((option) => (
              <label key={option.id} className="option-label">
                <input
                  type={question.questionType === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                  name={question.id}
                  value={option.optionValue}
                  checked={
                    question.questionType === 'MULTIPLE_CHOICE'
                      ? Array.isArray(localValue) && localValue.includes(option.optionValue)
                      : localValue === option.optionValue
                  }
                  onChange={(e) => {
                    if (question.questionType === 'MULTIPLE_CHOICE') {
                      const currentValues = Array.isArray(localValue) ? localValue : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.optionValue]
                        : currentValues.filter(v => v !== option.optionValue);
                      handleValueChange(newValues);
                    } else {
                      handleValueChange(option.optionValue);
                    }
                  }}
                  disabled={isSkipped}
                />
                <span className="option-text">{option.optionText}</span>
              </label>
            ))}
          </div>
        );

      case 'TEXT':
        return (
          <textarea
            className="question-textarea"
            value={typeof localValue === 'string' ? localValue : ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={question.placeholder}
            disabled={isSkipped}
            rows={4}
          />
        );

      case 'NUMBER':
        return (
          <input
            type="number"
            className="question-number-input"
            value={typeof localValue === 'number' ? localValue : ''}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            placeholder={question.placeholder}
            disabled={isSkipped}
            min={question.validationRules?.minValue}
            max={question.validationRules?.maxValue}
          />
        );

      case 'DATE':
        return (
          <input
            type="date"
            className="question-date-input"
            value={typeof localValue === 'string' ? localValue : ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={isSkipped}
          />
        );

      case 'SCALE':
        return (
          <div className="question-scale">
            <input
              type="range"
              className="scale-slider"
              min={question.validationRules?.minValue || 1}
              max={question.validationRules?.maxValue || 10}
              value={typeof localValue === 'number' ? localValue : 5}
              onChange={(e) => handleValueChange(Number(e.target.value))}
              disabled={isSkipped}
            />
            <div className="scale-value">
              {typeof localValue === 'number' ? localValue : 5}
            </div>
          </div>
        );

      case 'YES_NO':
        return (
          <div className="question-yes-no">
            <label className="yes-no-option">
              <input
                type="radio"
                name={question.id}
                value="true"
                checked={localValue === true}
                onChange={() => handleValueChange(true)}
                disabled={isSkipped}
              />
              <span>Yes</span>
            </label>
            <label className="yes-no-option">
              <input
                type="radio"
                name={question.id}
                value="false"
                checked={localValue === false}
                onChange={() => handleValueChange(false)}
                disabled={isSkipped}
              />
              <span>No</span>
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            className="question-text-input"
            value={typeof localValue === 'string' ? localValue : ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={question.placeholder}
            disabled={isSkipped}
          />
        );
    }
  };

  return (
    <div className={`question-item ${question.isRequired ? 'required' : ''} ${isSkipped ? 'skipped' : ''}`}>
      <div className="question-header">
        <h3 className="question-text">
          {question.questionNumber}. {question.questionText}
        </h3>
      </div>

      <div className="question-input">
        {renderQuestionInput()}
      </div>

      {!question.isRequired && (
        <div className="question-actions">
          <button
            type="button"
            className="skip-button"
            onClick={handleSkip}
            disabled={isSkipped}
          >
            {isSkipped ? 'Skipped' : 'Skip Question'}
          </button>
        </div>
      )}

      {question.validationRules?.customErrorMessage && (
        <div className="validation-error">
          {question.validationRules.customErrorMessage}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
