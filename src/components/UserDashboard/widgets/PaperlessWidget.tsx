import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetDocumentsQuery, useUploadDocumentMutation } from '../../../service/PaperlessService';

interface PaperlessDocument {
  id: number;
  title: string;
  // Add other properties as needed
}

const PaperlessWidget: React.FC = () => {
  const { data: documents, error, isLoading, refetch } = useGetDocumentsQuery();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('document', selectedFile);
      try {
        await uploadDocument(formData).unwrap();
        setSelectedFile(null);
        refetch();
      } catch (err: unknown) {
        console.error('Failed to upload document: ', err);
      }
    }
  };

  // Temporary: UI to set the auth token
  const [token, setToken] = useState(localStorage.getItem('paperless_token') || '');
  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };
  const handleTokenSave = () => {
    localStorage.setItem('paperless_token', token);
    window.location.reload();
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Paperless Documents</h5>

        {/* Temporary Token Input */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Paperless API Token"
            value={token}
            onChange={handleTokenChange}
          />
          <button className="btn btn-outline-secondary" type="button" onClick={handleTokenSave}>
            Save Token
          </button>
        </div>
        <p className="card-text text-muted small">
          You can get a token from your Paperless user profile page at{' '}
          <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer">
            http://localhost:8000
          </a>
          .
        </p>
        {/* End Temporary Token Input */}

        <div className="input-group mb-3">
          <input type="file" className="form-control" onChange={handleFileChange} />
          <button className="btn btn-primary" type="button" onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {isLoading && <p>Loading documents...</p>}
        {error && <p className="text-danger">Error fetching documents. Is your token set correctly?</p>}
        {documents && documents.results && (
          <ul className="list-group">
            {documents.results.map((doc: PaperlessDocument) => (
              <li key={doc.id} className="list-group-item">
                <Link to={`/editdoc/${doc.id}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PaperlessWidget;