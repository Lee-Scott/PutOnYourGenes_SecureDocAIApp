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

  useEffect(() => {
    if (response) {
      setLocalValue(response.answerValue);
    }
  }, [response]);

  const handleValueChange = (value: string | number | boolean | string[]) => {
    setLocalValue(value);
    
    let textValue: string | undefined;
    if (typeof value === 'boolean') {
      textValue = value ? 'Yes' : 'No';
    } else if (typeof value === 'string') {
      textValue = value;
    } else if (Array.isArray(value)) {
      textValue = value.join(', ');
    }

    onResponse({
      questionId: question.id,
      answerValue: value,
      answerText: textValue,
      isSkipped: false
    });
  };

  const renderQuestionInput = () => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
      case 'SINGLE_CHOICE':
        return (
          <div className="option-group">
            {question.options?.map((option) => (
              <div key={option.id} className="option-item">
                <input
                  className="option-input"
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
                />
                <label className="option-label" htmlFor={`${question.id}-${option.id}`}>
                  {option.optionText}
                </label>
              </div>
            ))}
          </div>
        );

      case 'TEXT':
        return (
          <textarea
            className="form-textarea"
            value={typeof localValue === 'string' ? localValue : ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
          />
        );

      case 'NUMBER':
        return (
          <input
            type="number"
            className="form-input"
            value={typeof localValue === 'number' ? localValue : ''}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            placeholder={question.placeholder}
            min={question.validationRules?.minValue}
            max={question.validationRules?.maxValue}
          />
        );

      case 'DATE':
        return (
          <input
            type="date"
            className="form-input"
            value={typeof localValue === 'string' ? localValue : ''}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        );

      case 'SCALE':
        return (
          <div className="scale-container">
            <input
              type="range"
              className="scale-input"
              min={question.validationRules?.minValue || 1}
              max={question.validationRules?.maxValue || 10}
              value={typeof localValue === 'number' ? localValue : 5}
              onChange={(e) => handleValueChange(Number(e.target.value))}
            />
            <div className="scale-labels">
              <span>{question.validationRules?.minValue || 1}</span>
              <span className="scale-value">
                {typeof localValue === 'number' ? localValue : 5}
              </span>
              <span>{question.validationRules?.maxValue || 10}</span>
            </div>
          </div>
        );

      case 'YES_NO':
        return (
          <div className="yes-no-group">
            <button
              type="button"
              className={`yes-no-button yes ${localValue === true ? 'selected' : ''}`}
              onClick={() => handleValueChange(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`yes-no-button no ${localValue === false ? 'selected' : ''}`}
              onClick={() => handleValueChange(false)}
            >
              No
            </button>
          </div>
        );

      default:
        return (
          <input
            type="text"
            className="form-input"
            value={typeof localValue === 'string' ? localValue : ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={question.placeholder}
          />
        );
    }
  };

  return (
    <div className={`question-item ${question.isRequired ? 'required' : ''}`}>
      <div className="question-header">
        <h3 className="question-text">
          {question.questionNumber}. {question.questionText}
        </h3>
      </div>

      <div className="question-input">
        {renderQuestionInput()}
      </div>

      {question.validationRules?.customErrorMessage && (
        <div className="validation-error">
          {question.validationRules.customErrorMessage}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
