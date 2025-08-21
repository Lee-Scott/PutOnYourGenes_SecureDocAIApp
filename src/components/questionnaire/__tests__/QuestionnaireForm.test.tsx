import { render, screen, fireEvent, waitFor } from '../../../utils/Test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';
import * as QuestionnaireService from '../../../service/QuestionnaireService';
import QuestionnaireForm from '../QuestionnaireForm';
import { useGetQuestionnaireByIdQuery } from '../../../service/QuestionnaireService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' }),
    };
});

const mockQuestionnaire = {
  data: {
    id: '1',
    title: 'Health Survey',
    pages: [
      { id: 'p1', title: 'Page 1', questions: [{ id: 'q1', questionText: 'What is your name?', questionType: 'TEXT', isRequired: true }] },
      { id: 'p2', title: 'Page 2', questions: [{ id: 'q2', questionText: 'What is your age?', questionType: 'NUMBER', isRequired: false }] },
    ],
  },
};

describe('QuestionnaireForm', () => {
  const submitResponseFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(QuestionnaireService, 'useGetQuestionnaireByIdQuery').mockReturnValue({
      data: mockQuestionnaire,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    vi.spyOn(QuestionnaireService, 'useSubmitQuestionnaireResponseMutation').mockReturnValue([submitResponseFn, { isLoading: false, reset: vi.fn() }]);
    submitResponseFn.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  test('renders loading state', () => {
    (useGetQuestionnaireByIdQuery as Mock).mockReturnValue({ isLoading: true });
    render(<MemoryRouter><QuestionnaireForm /></MemoryRouter>);
    expect(screen.getByText(/Loading questionnaire.../i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useGetQuestionnaireByIdQuery as Mock).mockReturnValue({ error: new Error('Not found') });
    render(<MemoryRouter><QuestionnaireForm /></MemoryRouter>);
    expect(screen.getByText(/Questionnaire not found/i)).toBeInTheDocument();
  });

  test('renders the first page of the questionnaire', () => {
    render(<MemoryRouter><QuestionnaireForm /></MemoryRouter>);
    expect(screen.getByText('Health Survey')).toBeInTheDocument();
    expect(screen.getByText(/What is your name\?/i)).toBeInTheDocument();
  });

  test('navigates to the next page', async () => {
    render(
        <MemoryRouter initialEntries={['/questionnaires/1/form']}>
            <Routes>
                <Route path="/questionnaires/:id/form" element={<QuestionnaireForm />} />
            </Routes>
        </MemoryRouter>
    );
    // Answer the required question
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
        expect(screen.getByText(/What is your age\?/i)).toBeInTheDocument();
    });
  });

  test('prevents navigation if required questions are not answered', async () => {
    render(
        <MemoryRouter initialEntries={['/questionnaires/1/form']}>
            <Routes>
                <Route path="/questionnaires/:id/form" element={<QuestionnaireForm />} />
            </Routes>
        </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
        expect(screen.getByText(/What is your name\?/i)).toBeInTheDocument();
    });
  });

  test('submits the form', async () => {
    render(
        <MemoryRouter initialEntries={['/questionnaires/1/form']}>
            <Routes>
                <Route path="/questionnaires/:id/form" element={<QuestionnaireForm />} />
            </Routes>
        </MemoryRouter>
    );
    // Answer questions
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
        fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '30' } });
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(submitResponseFn).toHaveBeenCalled();
    });
  });
});
