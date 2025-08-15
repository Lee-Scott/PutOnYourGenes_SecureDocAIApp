import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedReport, selectIntegration } from '../../store/slices/integrationSlice';

const IntegrationHub: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedIntegrations } = useSelector(selectIntegration);
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

  const handleViewReport = (reportUrl: string) => {
    dispatch(setSelectedReport(reportUrl));
    navigate('/report-viewer');
  };

  const allIntegrations = {
    PureInsight: (
      <div className="pureinsight-section" style={{ margin: '2rem 0' }}>
        <h3>PureInsight</h3>
        <p>Gain deeper insights into your health with advanced analytics. Pricing is based on the specific reports and services you choose. <a href="https://www.pureinsight.com" target="_blank" rel="noopener noreferrer">Learn more</a>.</p>
        <img src="/practice-qr-code.png" alt="PureInsight QR Code" style={{ maxWidth: '200px', margin: '1rem auto' }} />
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => handleViewReport('/patient-report-example.pdf')}>
            View Sample Patient Report
          </button>
          <button className="btn btn-secondary" style={{ marginLeft: '1rem' }} onClick={() => handleViewReport('/practitioner-report-example.pdf')}>
            View Sample Practitioner Report
          </button>
        </div>
      </div>
    ),
    Fullscript: (
      <div className="integration-options" style={{ margin: '2rem 0' }}>
        <h3>Fullscript</h3>
        <p>Order practitioner-grade supplements and wellness products. Prices vary depending on the products selected by your practitioner, with most items ranging from $20 to $100. <a href="https://fullscript.com/about" target="_blank" rel="noopener noreferrer">Learn more</a>.</p>
        <button className="btn btn-primary" onClick={() => handleNavigate(fullscriptUrl)}>
          Continue to Fullscript
        </button>
      </div>
    ),
    'VitaminLab': (
      <div className="integration-options" style={{ margin: '2rem 0' }}>
        <h3>VitaminLab</h3>
        <p>Get personalized vitamin formulas based on your unique needs. Pricing varies depending on the customized formula, typically ranging from $50 to $150 per month. <a href="https://getvitaminlab.com/pages/about-us" target="_blank" rel="noopener noreferrer">Learn more</a>.</p>
        <button className="btn btn-primary" onClick={() => handleNavigate('https://getvitaminlab.com/take-a-quiz/')}>
          Connect
        </button>
      </div>
    ),
    'Rupa Health': (
      <div className="integration-options" style={{ margin: '2rem 0' }}>
        <h3>Rupa Health</h3>
        <p>Order specialty lab tests from a wide range of companies. The cost can range from under $100 to over $1000, depending on the complexity of the tests ordered by your practitioner. <a href="https://www.rupahealth.com/about-us" target="_blank" rel="noopener noreferrer">Learn more</a>.</p>
        <button className="btn btn-primary" onClick={() => handleNavigate('https://www.rupahealth.com/patients')}>
          Connect
        </button>
      </div>
    ),
    '3X4 Genetics': (
      <div className="integration-options" style={{ margin: '2rem 0' }}>
        <h3>3X4 Genetics</h3>
        <p>Unlock personalized health recommendations based on your DNA with the 3X4 Test and Health app. The test costs $299. <a href="https://3x4genetics.com/about" target="_blank" rel="noopener noreferrer">Learn more</a>.</p>
        <button className="btn btn-primary" onClick={() => handleNavigate('https://3x4genetics.com/products/3x4-health')}>
          Connect
        </button>
      </div>
    ),
  };

  const integrationsToDisplay = selectedIntegrations.length > 0 
    ? selectedIntegrations 
    : Object.keys(allIntegrations);

  return (
    <div className="integration-hub-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Connect with Our Partners</h2>
      <p>Please choose one of the following options to proceed.</p>

      {integrationsToDisplay.map((integrationName: string, index: number) => (
        <React.Fragment key={integrationName}>
          {allIntegrations[integrationName as keyof typeof allIntegrations]}
          {index < integrationsToDisplay.length - 1 && <hr style={{ margin: '2rem 0' }} />}
        </React.Fragment>
      ))}

      <hr style={{ margin: '2rem 0' }} />

      <div className="manual-upload-section">
        <h3>Manual Upload</h3>
        <p>Securely upload your health documents, such as lab results, medical charts, or genetic reports. We accept various formats, including PDF, images, and text files. Your privacy is our priority; all uploads are encrypted and stored securely.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.txt,.csv,.json,.jpg,.jpeg,.png"
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
