import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';
import Questionnaires from './Questionnaires';
import { useGetQuestionnairesQuery, useGetUserResponsesQuery } from '../../service/QuestionnaireService';

// Mock the service
vi.mock('../../service/QuestionnaireService', () => ({
  useGetQuestionnairesQuery: vi.fn(),
  useGetUserResponsesQuery: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Questionnaires', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
      data: { data: { questionnaires: [] } },
      isLoading: false,
      error: null,
    });
    (useGetUserResponsesQuery as Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });
  });

  test('renders loading state', () => {
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
      isLoading: true,
    });
    render(<MemoryRouter><Questionnaires /></MemoryRouter>);
    expect(screen.getByText(/Loading questionnaires.../i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
      error: new Error('Failed to fetch'),
    });
    render(<MemoryRouter><Questionnaires /></MemoryRouter>);
    expect(screen.getByText(/Error loading questionnaires/i)).toBeInTheDocument();
  });

  test('renders available questionnaires', () => {
    const mockQuestionnaires = [
      { id: '1', title: 'Health Survey', description: 'A general health survey.', category: 'General', estimatedTimeMinutes: 10, totalQuestions: 20, isActive: true },
    ];
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
      data: { data: { questionnaires: mockQuestionnaires } },
      isLoading: false,
    });
    render(<MemoryRouter><Questionnaires /></MemoryRouter>);
    expect(screen.getByText('Health Survey')).toBeInTheDocument();
    expect(screen.getByText(/A general health survey/i)).toBeInTheDocument();
  });

  test('renders completed questionnaires when tab is switched', () => {
    const mockResponses = [
      { id: 'resp1', questionnaireId: '1', completedAt: new Date().toISOString() },
    ];
    const mockQuestionnaires = [
        { id: '1', title: 'Health Survey', description: 'A general health survey.', category: 'General', estimatedTimeMinutes: 10, totalQuestions: 20, isActive: true },
    ];
    (useGetUserResponsesQuery as Mock).mockReturnValue({
      data: { data: mockResponses },
      isLoading: false,
    });
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
        data: { data: { questionnaires: mockQuestionnaires } },
        isLoading: false,
    });

    render(<MemoryRouter><Questionnaires /></MemoryRouter>);
    fireEvent.click(screen.getByText(/Completed/i));
    expect(screen.getByText(/Completed on:/i)).toBeInTheDocument();
  });

  test('navigates to questionnaire details on "View Details" click', () => {
    const mockQuestionnaires = [
        { id: '1', title: 'Health Survey', description: 'A general health survey.', category: 'General', estimatedTimeMinutes: 10, totalQuestions: 20, isActive: true },
    ];
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
      data: { data: { questionnaires: mockQuestionnaires } },
      isLoading: false,
    });
    render(<MemoryRouter><Questionnaires /></MemoryRouter>);
    fireEvent.click(screen.getByText(/View Details/i));
    expect(mockNavigate).toHaveBeenCalledWith('/questionnaires/1');
  });

  test('navigates to form on "Start" click', () => {
    const mockQuestionnaires = [
        { id: '1', title: 'Health Survey', description: 'A general health survey.', category: 'General', estimatedTimeMinutes: 10, totalQuestions: 20, isActive: true },
    ];
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
      data: { data: { questionnaires: mockQuestionnaires } },
      isLoading: false,
    });
    render(<MemoryRouter><Questionnaires /></MemoryRouter>);
    fireEvent.click(screen.getByText(/Start/i));
    expect(mockNavigate).toHaveBeenCalledWith('/questionnaires/1/form');
  });

  test('navigates to results on "View Results" click', () => {
    const mockResponses = [
        { id: 'resp1', questionnaireId: '1', completedAt: new Date().toISOString() },
    ];
    const mockQuestionnaires = [
        { id: '1', title: 'Health Survey', description: 'A general health survey.', category: 'General', estimatedTimeMinutes: 10, totalQuestions: 20, isActive: true },
    ];
    (useGetUserResponsesQuery as Mock).mockReturnValue({
      data: { data: mockResponses },
      isLoading: false,
    });
    (useGetQuestionnairesQuery as Mock).mockReturnValue({
        data: { data: { questionnaires: mockQuestionnaires } },
        isLoading: false,
    });
    render(<MemoryRouter><Questionnaires /></MemoryRouter>);
    fireEvent.click(screen.getByText(/Completed/i));
    fireEvent.click(screen.getByText(/View Results/i));
    expect(mockNavigate).toHaveBeenCalledWith('/questionnaires/results/resp1');
  });
});
