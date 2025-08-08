import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { IQuestionnaireResponse } from '../models/IQuestionnaireResponse';

/**
 * PDF Generation Utilities
 * 
 * Provides functionality for generating PDF reports from questionnaire results
 * including formatted summaries, recommendations, and visual elements.
 */

interface PDFGenerationOptions {
  includeRecommendations?: boolean;
  includeCategoryBreakdown?: boolean;
  includeVisualCharts?: boolean;
  headerInfo?: {
    patientName?: string;
    providerId?: string;
    clinicName?: string;
  };
}

/**
 * Generate a comprehensive PDF report from questionnaire response
 * 
 * @param response - The questionnaire response data
 * @param options - PDF generation options
 * @returns Promise<void> - Downloads the PDF automatically
 */
export const generateQuestionnaireResultsPDF = async (
  response: IQuestionnaireResponse,
  options: PDFGenerationOptions = {}
): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // PDF Configuration
    const primaryColor = [0, 123, 255]; // #007bff
    const secondaryColor = [108, 117, 125]; // #6c757d
    const successColor = [40, 167, 69]; // #28a745
    
    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to add section header
    const addSectionHeader = (title: string, color = primaryColor) => {
      checkPageBreak(15);
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.rect(margin, yPosition, pageWidth - (margin * 2), 8, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin + 5, yPosition + 5.5);
      
      yPosition += 12;
      pdf.setTextColor(0, 0, 0);
    };

    // Header with logo space and title
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    // Title
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Health Questionnaire Results', margin, 15);

    // Patient info if provided
    if (options.headerInfo?.patientName) {
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Patient: ${options.headerInfo.patientName}`, pageWidth - margin - 60, 10);
    }

    // Generation date
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, 15);
    
    yPosition = 35;

    // Summary Section
    addSectionHeader('Results Summary');
    
    // Completion info
    const completionDate = new Date(response.completedAt || '').toLocaleDateString();
    const totalQuestions = response.responses?.length || 0;
    const answeredQuestions = response.responses?.filter(r => !r.isSkipped).length || 0;
    const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Summary data in a table-like format
    const summaryData = [
      ['Completion Date:', completionDate],
      ['Total Score:', `${response.totalScore || 'N/A'}`],
      ['Completion Rate:', `${completionRate}%`],
      ['Questions Answered:', `${answeredQuestions} of ${totalQuestions}`]
    ];

    summaryData.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, margin + 5, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, margin + 60, yPosition);
      yPosition += 7;
    });

    yPosition += 5;

    // Category Breakdown Section
    if (options.includeCategoryBreakdown !== false && response.categoryScores?.length) {
      addSectionHeader('Category Breakdown');
      
      response.categoryScores.forEach(category => {
        checkPageBreak(12);
        
        // Category name
        pdf.setFont('helvetica', 'bold');
        pdf.text(category.category, margin + 5, yPosition);
        
        // Score
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${category.score}/${category.maxScore} (${category.percentage}%)`, margin + 80, yPosition);
        
        // Progress bar
        const barWidth = 80;
        const barHeight = 4;
        const barX = margin + 5;
        const barY = yPosition + 2;
        
        // Background
        pdf.setFillColor(233, 236, 239);
        pdf.rect(barX, barY, barWidth, barHeight, 'F');
        
        // Fill
        const fillWidth = (category.percentage / 100) * barWidth;
        let fillColor = successColor;
        if (category.percentage < 40) {
          fillColor = [220, 53, 69]; // danger
        } else if (category.percentage < 70) {
          fillColor = [255, 193, 7]; // warning
        }
        
        pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        pdf.rect(barX, barY, fillWidth, barHeight, 'F');
        
        yPosition += 12;
      });
      
      yPosition += 5;
    }

    // Recommendations Section
    if (options.includeRecommendations !== false) {
      addSectionHeader('Health Recommendations');
      
      const recommendations = generateRecommendationsForPDF(response);
      
      recommendations.forEach((rec, index) => {
        checkPageBreak(25);
        
        // Priority badge
        let badgeColor;
        switch (rec.priority) {
          case 'high':
            badgeColor = [220, 53, 69];
            break;
          case 'medium':
            badgeColor = [255, 193, 7];
            break;
          default:
            badgeColor = successColor;
        }
        
        pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        
        const badgeWidth = 20;
        const badgeHeight = 5;
        pdf.rect(pageWidth - margin - badgeWidth, yPosition - 2, badgeWidth, badgeHeight, 'F');
        pdf.text(rec.priority.toUpperCase(), pageWidth - margin - badgeWidth + 2, yPosition + 1);
        
        // Recommendation title
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(rec.title, margin + 5, yPosition);
        yPosition += 7;
        
        // Recommendation description
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        
        const descriptionLines = pdf.splitTextToSize(rec.description, pageWidth - margin * 2 - 10);
        pdf.text(descriptionLines, margin + 5, yPosition);
        yPosition += descriptionLines.length * 4;
        
        // Category tag
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFontSize(8);
        pdf.text(`Category: ${rec.category}`, margin + 5, yPosition);
        yPosition += 8;
        
        // Separator line
        if (index < recommendations.length - 1) {
          pdf.setDrawColor(233, 236, 239);
          pdf.line(margin + 5, yPosition, pageWidth - margin - 5, yPosition);
          yPosition += 5;
        }
      });
    }

    // Footer with disclaimer
    const footerY = pageHeight - 15;
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, footerY - 5, pageWidth, 20, 'F');
    
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    const disclaimerText = 'This report is generated from questionnaire responses. Please consult with your healthcare provider for professional medical advice.';
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, pageWidth - margin * 2);
    pdf.text(disclaimerLines, margin, footerY);

    // Page numbers
    const pageCount = (pdf as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setFontSize(8);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 5);
    }

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Health_Assessment_Results_${timestamp}.pdf`;
    
    // Download the PDF
    pdf.save(filename);
    
    console.log('PDF generated successfully:', filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

/**
 * Generate recommendations for PDF (similar to component logic)
 */
const generateRecommendationsForPDF = (response: IQuestionnaireResponse) => {
  const recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }> = [];
  
  const totalScore = response.totalScore || 0;
  const categoryScores = response.categoryScores || [];

  // Generate recommendations based on total score
  if (totalScore < 30) {
    recommendations.push({
      title: "Immediate Health Assessment Recommended",
      description: "Your responses indicate areas that may benefit from professional medical evaluation. Consider scheduling an appointment with your healthcare provider.",
      priority: 'high',
      category: 'Medical Care'
    });
  } else if (totalScore < 60) {
    recommendations.push({
      title: "Preventive Care Focus",
      description: "Consider implementing preventive health measures and lifestyle modifications to improve your overall wellness.",
      priority: 'medium',
      category: 'Prevention'
    });
  } else {
    recommendations.push({
      title: "Maintain Healthy Habits",
      description: "Your responses suggest good health awareness. Continue with your current health practices and regular check-ups.",
      priority: 'low',
      category: 'Maintenance'
    });
  }

  // Generate category-specific recommendations
  categoryScores.forEach(category => {
    if (category.percentage < 40) {
      recommendations.push({
        title: `${category.category} Attention Needed`,
        description: `Your ${category.category.toLowerCase()} scores suggest this area may need focused attention and potential professional guidance.`,
        priority: 'high',
        category: category.category
      });
    } else if (category.percentage < 70) {
      recommendations.push({
        title: `${category.category} Improvement Opportunity`,
        description: `Consider strategies to enhance your ${category.category.toLowerCase()} wellness through lifestyle changes or professional consultation.`,
        priority: 'medium',
        category: category.category
      });
    }
  });

  // Add general wellness recommendation
  recommendations.push({
    title: "Regular Health Monitoring",
    description: "Continue monitoring your health by completing questionnaires periodically to track changes and improvements.",
    priority: 'low',
    category: 'Monitoring'
  });

  return recommendations;
};

/**
 * Generate PDF from HTML element (alternative method)
 * 
 * @param elementId - ID of the HTML element to convert
 * @param filename - Name for the downloaded PDF file
 */
export const generatePDFFromElement = async (
  elementId: string,
  filename: string = 'questionnaire-results.pdf'
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    // Hide any elements that shouldn't be in the PDF
    const actionButtons = element.querySelectorAll('.result-item-actions, .actions');
    actionButtons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Restore hidden elements
    actionButtons.forEach(button => {
      (button as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
    
    console.log('PDF generated successfully from element:', filename);
    
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    throw new Error('Failed to generate PDF from element');
  }
};

export default {
  generateQuestionnaireResultsPDF,
  generatePDFFromElement
};
