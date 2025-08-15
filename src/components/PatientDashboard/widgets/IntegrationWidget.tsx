import React from 'react';
import { Link } from 'react-router-dom';

const IntegrationWidget: React.FC = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Integrations</h5>
        <p className="card-text">Connect with our partners and upload documents.</p>
        <Link to="/integration-hub" className="btn btn-primary">Connect</Link>
      </div>
    </div>
  );
};

export default IntegrationWidget;
