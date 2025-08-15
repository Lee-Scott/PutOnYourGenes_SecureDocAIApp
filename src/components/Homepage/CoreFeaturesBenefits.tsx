import React from 'react';
import './CoreFeatures.css';

const CoreFeaturesBenefits: React.FC = () => {
  return (
    <div>
      <div className="feature-block">
        <div className="feature-text">
          <h2>Secure Document Upload</h2>
          <p>Easily upload and manage your documents with robust security and privacy controls.</p>
        </div>
        <div className="feature-visual">
          <img src="https://placehold.co/500x300.gif" alt="Secure Document Upload Animation" />
        </div>
      </div>
      <div className="feature-block">
        <div className="feature-text">
          <h2>AI-Powered Agents</h2>
          <p>Leverage intelligent agents to automate document analysis, tagging, and data extraction.</p>
        </div>
        <div className="feature-visual">
          <img src="https://placehold.co/500x300.gif" alt="AI-Powered Agents Animation" />
        </div>
      </div>
      <div className="feature-block">
        <div className="feature-text">
          <h2>Interactive Chat</h2>
          <p>Chat with your documents to quickly find information, get summaries, and ask questions.</p>
        </div>
        <div className="feature-visual">
          <img src="https://placehold.co/500x300.gif" alt="Interactive Chat Animation" />
        </div>
      </div>
    </div>
  );
};

export default CoreFeaturesBenefits;