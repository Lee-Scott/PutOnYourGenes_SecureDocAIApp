import React from 'react';
import { Link } from 'react-router-dom';
import { documentAPI } from '../../../service/DocumentService';
import Document from '../../documents/Document';
import DocumentLoader from '../../documents/DocumentLoader';

const DocumentWidget: React.FC = () => {
  const { data: documentData, isLoading } = documentAPI.useFetchDocumentsQuery({ page: 0, size: 5, name: '' });

  if (isLoading) {
    return <DocumentLoader />;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Recent Documents</h5>
        <div className="candidate-list">
          {documentData?.data.documents.content?.length === 0 && (
            <div className="card mt-4 align-items-center row" style={{ border: 'none', boxShadow: 'none' }}>
              <h4>No documents found.</h4>
              <p>You can upload your documents from the integration page.</p>
            </div>
          )}
          {documentData?.data.documents.content.map(document => (
            <Document {...document} key={document.id} />
          ))}
        </div>
        <Link to="/documents" className="btn btn-primary mt-3">View all documents</Link>
      </div>
    </div>
  );
};

export default DocumentWidget;
