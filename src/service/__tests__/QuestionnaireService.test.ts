import { describe, it, expect } from 'vitest';
import { questionnaireAPI } from '../QuestionnaireService';
import { setupStore } from '../../store/store';

const store = setupStore();

describe('QuestionnaireService', () => {
  it('should have the correct endpoints', () => {
    expect(questionnaireAPI.endpoints.getQuestionnaires).toBeDefined();
    expect(questionnaireAPI.endpoints.getQuestionnaireById).toBeDefined();
    expect(questionnaireAPI.endpoints.createQuestionnaire).toBeDefined();
    expect(questionnaireAPI.endpoints.updateQuestionnaire).toBeDefined();
    expect(questionnaireAPI.endpoints.deleteQuestionnaire).toBeDefined();
    expect(questionnaireAPI.endpoints.submitQuestionnaireResponse).toBeDefined();
    expect(questionnaireAPI.endpoints.updateQuestionnaireResponse).toBeDefined();
    expect(questionnaireAPI.endpoints.getUserResponses).toBeDefined();
    expect(questionnaireAPI.endpoints.getQuestionnaireResponse).toBeDefined();
    expect(questionnaireAPI.endpoints.getQuestionnaireAnalytics).toBeDefined();
    expect(questionnaireAPI.endpoints.deleteQuestionnaireResponse).toBeDefined();
  });

  it('getQuestionnaires should return a list of questionnaires', async () => {
    const result = await store.dispatch(
      questionnaireAPI.endpoints.getQuestionnaires.initiate({})
    );
    expect(result.status).toBe('fulfilled');
    expect(result.data?.data.questionnaires).toHaveLength(2);
    expect(result.data?.data.questionnaires[0].title).toBe('Test Questionnaire 1');
  });

  it('getQuestionnaireById should return a single questionnaire', async () => {
    const result = await store.dispatch(
      questionnaireAPI.endpoints.getQuestionnaireById.initiate('1')
    );
    expect(result.status).toBe('fulfilled');
    expect(result.data?.data.title).toBe('Test Questionnaire 1');
  });

  it('createQuestionnaire should create a new questionnaire', async () => {
    const newQuestionnaire = {
      title: 'New Questionnaire',
      description: 'This is a new questionnaire.',
      category: 'General',
      pages: [],
      isActive: true,
      estimatedTimeMinutes: 10,
    };
    const result = await store
      .dispatch(
        questionnaireAPI.endpoints.createQuestionnaire.initiate(newQuestionnaire)
      )
      .unwrap();
    expect(result.data.title).toBe('New Questionnaire');
    expect(result.data.id).toBe('3');
  });

  it('updateQuestionnaire should update an existing questionnaire', async () => {
    const updatedQuestionnaire = {
      title: 'Updated Questionnaire',
    };
    const result = await store
      .dispatch(
        questionnaireAPI.endpoints.updateQuestionnaire.initiate({
          id: '1',
          data: updatedQuestionnaire,
        })
      )
      .unwrap();
    expect(result.data.title).toBe('Updated Questionnaire');
  });

  it('deleteQuestionnaire should delete an existing questionnaire', async () => {
    const result = await store
      .dispatch(questionnaireAPI.endpoints.deleteQuestionnaire.initiate('1'))
      .unwrap();
    expect(result.message).toBe('Questionnaire 1 deleted successfully');
  });
});
