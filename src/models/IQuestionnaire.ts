/**
 * Interface for Questionnaire entity
 */
import { IQuestion, IQuestionRequest } from './IQuestion';

export interface IQuestionnaire {
  id: string;
  title: string;
  description: string;
  category: string;
  isActive: boolean;
  totalQuestions: number;
  estimatedTimeMinutes: number;
  pages: IQuestionPage[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * Interface for Questionnaire creation/update request
 */
export interface IQuestionnaireRequest {
  title: string;
  description: string;
  category: string;
  isActive: boolean;
  estimatedTimeMinutes: number;
  pages: IQuestionPageRequest[];
}

/**
 * Interface for Questionnaire list response
 */
export interface IQuestionnaireList {
  questionnaires: IQuestionnaire[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  timeStamp?: string;
  
}

/**
 * Interface for Question Page
 */
export interface IQuestionPage {
  id: string;
  questionnaireId: string;
  pageNumber: number;
  title: string;
  description?: string;
  questions: IQuestion[];
  isRequired: boolean;
}

/**
 * Interface for Question Page request
 */
export interface IQuestionPageRequest {
  pageNumber: number;
  title: string;
  description?: string;
  questions: IQuestionRequest[];
  isRequired: boolean;
}
