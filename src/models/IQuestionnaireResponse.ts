/**
 * Interface for User Questionnaire Response
 */
export interface IQuestionnaireResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  responses: IQuestionResponse[];
  isCompleted: boolean;
  completedAt?: string;
  startedAt: string;
  lastModifiedAt: string;
  totalScore?: number;
  categoryScores?: ICategoryScore[];
}

/**
 * Interface for Questionnaire Response request
 */
export interface IQuestionnaireResponseRequest {
  questionnaireId: string;
  responses: IQuestionResponseRequest[];
  isCompleted: boolean;
}

/**
 * Interface for Individual Question Response
 */
export interface IQuestionResponse {
  id: string;
  questionId: string;
  questionText: string;
  answerValue: string | number | boolean | string[];
  answerText?: string;
  isSkipped: boolean;
  respondedAt: string;
}

/**
 * Interface for Question Response request
 */
export interface IQuestionResponseRequest {
  questionId: string;
  answerValue: string | number | boolean | string[];
  answerText?: string;
  isSkipped: boolean;
}

/**
 * Interface for Category Scores
 */
export interface ICategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

/**
 * Interface for Questionnaire Analytics
 */
export interface IQuestionnaireAnalytics {
  questionnaireId: string;
  totalResponses: number;
  completionRate: number;
  averageCompletionTime: number;
  questionStats: IQuestionStats[];
  responseDistribution: IResponseDistribution[];
}

/**
 * Interface for Question Statistics
 */
export interface IQuestionStats {
  questionId: string;
  questionText: string;
  responseCount: number;
  skipRate: number;
  averageScore?: number;
  mostCommonAnswer?: string;
}

/**
 * Interface for Response Distribution
 */
export interface IResponseDistribution {
  optionValue: string;
  optionText: string;
  count: number;
  percentage: number;
}
