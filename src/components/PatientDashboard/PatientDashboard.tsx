import React from 'react';
import ReportWidget from './widgets/ReportWidget';
import QuestionnaireWidget from './widgets/QuestionnaireWidget';
import IntegrationWidget from './widgets/IntegrationWidget';
import ChatWidget from './widgets/ChatWidget';
import DocumentWidget from './widgets/DocumentWidget';
import './PatientDashboard.css';

const PatientDashboard: React.FC = () => {
  return (
    <div className="patient-dashboard-container container mtb">
      <h2>Patient Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-widget">
          <ReportWidget />
        </div>
        <div className="dashboard-widget">
          <QuestionnaireWidget />
        </div>
        <div className="dashboard-widget">
          <IntegrationWidget />
        </div>
        <div className="dashboard-widget-large">
          <ChatWidget />
        </div>
        <div className="dashboard-widget-large">
          <DocumentWidget />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
