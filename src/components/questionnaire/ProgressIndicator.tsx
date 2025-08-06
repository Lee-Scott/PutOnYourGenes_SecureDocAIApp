import React from 'react';

interface ProgressIndicatorProps {
  currentPage: number;
  totalPages: number;
  percentage: number;
}

/**
 * ProgressIndicator Component
 * 
 * Shows progress through the questionnaire:
 * - Progress bar visualization
 * - Current page number
 * - Percentage completion
 * - Page indicators
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentPage,
  totalPages,
  percentage
}) => {
  return (
    <div className="progress-indicator">
      <div className="progress-info">
        <span className="page-counter">
          Page {currentPage} of {totalPages}
        </span>
        <span className="percentage">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="page-indicators">
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className={`page-indicator ${
              index < currentPage 
                ? 'completed' 
                : index === currentPage - 1 
                ? 'current' 
                : 'pending'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
