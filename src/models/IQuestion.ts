/**
 * Type for question types
 */
export type QuestionType = 
  | 'MULTIPLE_CHOICE'
  | 'SINGLE_CHOICE'
  | 'TEXT'
  | 'NUMBER'
  | 'DATE'
  | 'SCALE'
  | 'YES_NO'
  | 'CHECKBOX';

/**
 * Interface for Question entity
 */
export interface IQuestion {
  id: string;
  pageId: string;
  questionNumber: number;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  options?: IQuestionOption[];
  validationRules?: IQuestionValidation;
  conditionalLogic?: IConditionalLogic;
  helpText?: string;
  placeholder?: string;
}

/**
 * Interface for Question request
 */
export interface IQuestionRequest {
  questionNumber: number;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  options?: IQuestionOptionRequest[];
  validationRules?: IQuestionValidation;
  conditionalLogic?: IConditionalLogic;
  helpText?: string;
  placeholder?: string;
}

/**
 * Interface for Question Option
 */
export interface IQuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  optionValue: string;
  orderIndex: number;
  isOther?: boolean;
}

/**
 * Interface for Question Option request
 */
export interface IQuestionOptionRequest {
  optionText: string;
  optionValue: string;
  orderIndex: number;
  isOther?: boolean;
}

/**
 * Interface for Question Validation rules
 */
export interface IQuestionValidation {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  customErrorMessage?: string;
}

/**
 * Interface for Conditional Logic
 */
export interface IConditionalLogic {
  showIf?: ICondition[];
  hideIf?: ICondition[];
}

/**
 * Interface for Conditions
 */
export interface ICondition {
  questionId: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number | boolean;
}
