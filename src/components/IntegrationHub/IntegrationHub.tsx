import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IntegrationHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullscriptUrl = import.meta.env.VITE_FULLSCRIPT_PRACTITIONER_URL;

  const handleNavigate = (url: string) => {
    window.open(url, '_blank');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="integration-hub-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Connect with Fullscript</h2>
      <p>Please choose one of the following options to proceed.</p>

      <div className="integration-options" style={{ margin: '2rem 0' }}>
        <h3>Option 1: Go to Fullscript</h3>
        <p>Click the button below to open Fullscript in a new tab. You can create an account and enter your information directly on their site.</p>
        <button className="btn btn-primary" onClick={() => handleNavigate(fullscriptUrl)}>
          Continue to Fullscript
        </button>
      </div>

      <div className="manual-upload-section">
        <h3>Option 2: Upload Your Results</h3>
        <p>If you have a JSON or CSV file of your questionnaire results, you can upload it here.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".json,.csv"
        />
        <button className="btn btn-outline" onClick={handleUploadClick}>
          Select File
        </button>
        {selectedFile && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Selected file:</strong> {selectedFile.name}</p>
            <button className="btn btn-primary" onClick={() => navigate('/documents')}>
              Upload and Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationHub;
