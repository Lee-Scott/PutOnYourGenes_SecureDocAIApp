import React from 'react';
import ReportWidget from './widgets/ReportWidget';
import QuestionnaireWidget from './widgets/QuestionnaireWidget';
import IntegrationWidget from './widgets/IntegrationWidget';
import ChatWidget from './widgets/ChatWidget';
import PaperlessWidget from './widgets/PaperlessWidget';
import './UserDashboard.css';

const UserDashboard: React.FC = () => {
  return (
    <div className="user-dashboard-container container mtb">
      <h2>User Dashboard</h2>
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
          <PaperlessWidget />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;