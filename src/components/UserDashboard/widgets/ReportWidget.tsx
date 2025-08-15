import React from 'react';
import { Link } from 'react-router-dom';

const ReportWidget: React.FC = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Reports</h5>
        <p className="card-text">View your latest health reports.</p>
        <Link to="/report-viewer" className="btn btn-primary">View Reports</Link>
      </div>
    </div>
  );
};

export default ReportWidget;