import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach, beforeAll, Mock } from 'vitest';
import * as QuestionnaireService from '../../../service/QuestionnaireService';
import QuestionnaireBuilder from '../QuestionnaireBuilder';
import { useCreateQuestionnaireMutation } from '../../../service/QuestionnaireService';

// Mock the service
// No longer mocking the entire module

describe('QuestionnaireBuilder', () => {
  const createQuestionnaireFn = vi.fn();

  beforeAll(() => {
    vi.spyOn(QuestionnaireService, 'useCreateQuestionnaireMutation').mockReturnValue([createQuestionnaireFn, { isLoading: false, reset: vi.fn() }]);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the builder form with default values', () => {
    render(<MemoryRouter><QuestionnaireBuilder /></MemoryRouter>);
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  test('allows adding and removing pages', () => {
    render(<MemoryRouter><QuestionnaireBuilder /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Add Page/i }));
    expect(screen.getByText('Page 2')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Remove Page/i })[1]);
    expect(screen.queryByText('Page 2')).not.toBeInTheDocument();
  });

  test('allows adding and removing questions', () => {
    render(<MemoryRouter><QuestionnaireBuilder /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    expect(screen.getByText('Question 2')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Remove Question/i })[1]);
    expect(screen.queryByText('Question 2')).not.toBeInTheDocument();
  });

  test('updates state on input change', () => {
    render(<MemoryRouter><QuestionnaireBuilder /></MemoryRouter>);
    const titleInput = screen.getByLabelText('Title:');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');
  });

  test('submits the form and calls the mutation', async () => {
    createQuestionnaireFn.mockReturnValue({
        unwrap: () => Promise.resolve({ message: 'Questionnaire created successfully!' })
    });
    render(<MemoryRouter><QuestionnaireBuilder /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Test Questionnaire' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'A test description.' } });
    fireEvent.change(screen.getByLabelText(/Page Title/i), { target: { value: 'Page 1 Title' } });
    fireEvent.change(screen.getByLabelText(/Page Description/i), { target: { value: 'Page 1 Desc' } });
    fireEvent.change(screen.getByLabelText('Text:'), { target: { value: 'Question 1 Text' } });

    fireEvent.submit(screen.getByRole('button', { name: /Create Questionnaire/i }));

    await waitFor(() => {
      expect(createQuestionnaireFn).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Questionnaire',
        description: 'A test description.',
      }));
    });
    expect(await screen.findByText(/Questionnaire created successfully!/i)).toBeInTheDocument();
  });

  test('shows an error message on submission failure', async () => {
    createQuestionnaireFn.mockReturnValue({
        unwrap: () => Promise.reject(new Error('Failed to create'))
    });
    render(<MemoryRouter><QuestionnaireBuilder /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Test Questionnaire' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'A test description.' } });
    fireEvent.change(screen.getByLabelText(/Page Title/i), { target: { value: 'Page 1 Title' } });
    fireEvent.change(screen.getByLabelText(/Page Description/i), { target: { value: 'Page 1 Desc' } });
    fireEvent.change(screen.getByLabelText('Text:'), { target: { value: 'Question 1 Text' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /Create Questionnaire/i }));

    expect(await screen.findByText(/Failed to create questionnaire/i)).toBeInTheDocument();
  });
});
