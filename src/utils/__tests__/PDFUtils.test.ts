import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateQuestionnaireResultsPDF, generatePDFFromElement } from '../PDFUtils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IQuestionnaireResponse } from '../../models/IQuestionnaireResponse';

// Mock jsPDF and html2canvas
vi.mock('jspdf', () => {
  const mockPdf = {
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
      pages: [], // Mock pages for page number generation
    },
    addPage: vi.fn(),
    setFillColor: vi.fn(),
    rect: vi.fn(),
    setTextColor: vi.fn(),
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    line: vi.fn(),
    addImage: vi.fn(),
    save: vi.fn(),
    splitTextToSize: vi.fn((text: string) => [text]),
    setPage: vi.fn(),
    setDrawColor: vi.fn(),
  };
  return {
    default: vi.fn(() => mockPdf),
  };
});

vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

describe('PDFUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateQuestionnaireResultsPDF', () => {
    const mockResponse: IQuestionnaireResponse = {
      id: '1',
      userId: 'user1',
      questionnaireId: 'q1',
      completedAt: new Date().toISOString(),
      totalScore: 85,
      responses: [{ questionId: 'q1-1', answer: 'Yes', isSkipped: false }],
      categoryScores: [
        { category: 'Health', score: 40, maxScore: 50, percentage: 80 },
      ],
    };

    it('should generate a PDF with a header and summary', async () => {
      await generateQuestionnaireResultsPDF(mockResponse);
      const jspdfInstance = new jsPDF();
      expect(jspdfInstance.text).toHaveBeenCalledWith('Health Questionnaire Results', expect.any(Number), expect.any(Number));
      expect(jspdfInstance.text).toHaveBeenCalledWith('Results Summary', expect.any(Number), expect.any(Number));
    });

    it('should include category breakdown if available', async () => {
      await generateQuestionnaireResultsPDF(mockResponse, { includeCategoryBreakdown: true });
      const jspdfInstance = new jsPDF();
      expect(jspdfInstance.text).toHaveBeenCalledWith('Category Breakdown', expect.any(Number), expect.any(Number));
      expect(jspdfInstance.text).toHaveBeenCalledWith('Health', expect.any(Number), expect.any(Number));
    });

    it('should include recommendations', async () => {
      await generateQuestionnaireResultsPDF(mockResponse, { includeRecommendations: true });
      const jspdfInstance = new jsPDF();
      expect(jspdfInstance.text).toHaveBeenCalledWith('Health Recommendations', expect.any(Number), expect.any(Number));
    });

    it('should save the PDF', async () => {
      await generateQuestionnaireResultsPDF(mockResponse);
      const jspdfInstance = new jsPDF();
      expect(jspdfInstance.save).toHaveBeenCalledWith(expect.stringMatching(/Health_Assessment_Results_.*\.pdf/));
    });
  });

  describe('generatePDFFromElement', () => {
    beforeEach(() => {
      // Mock document.getElementById
      const mockElement = document.createElement('div');
      mockElement.innerHTML = '<button class="result-item-actions"></button>';
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      // Mock html2canvas to return a mock canvas
      (html2canvas as vi.Mock).mockResolvedValue({
        toDataURL: () => 'data:image/png;base64,',
        width: 500,
        height: 500,
      });
    });

    it('should throw an error if the element is not found', async () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      await expect(generatePDFFromElement('non-existent-id')).rejects.toThrow("Failed to generate PDF from element");
    });

    it('should call html2canvas and save a PDF', async () => {
      await generatePDFFromElement('test-id', 'test.pdf');
      expect(html2canvas).toHaveBeenCalled();
      const jspdfInstance = new jsPDF();
      expect(jspdfInstance.addImage).toHaveBeenCalled();
      expect(jspdfInstance.save).toHaveBeenCalledWith('test.pdf');
    });
  });
});