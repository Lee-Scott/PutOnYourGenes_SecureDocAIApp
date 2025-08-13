import React from 'react';
import { documentAPI } from '../../service/DocumentService';
import Document from '../documents/Document';
import DocumentLoader from '../documents/DocumentLoader';

const PatientDashboard: React.FC = () => {
  const { data: documentData, isLoading } = documentAPI.useFetchDocumentsQuery({ page: 0, size: 100, name: '' });

  if (isLoading) {
    return <DocumentLoader />;
  }

  return (
    <div className="patient-dashboard-container container mtb">
      <h2>Your Health Documents</h2>
      <p>Here are the lab results and other documents you have uploaded.</p>
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
    </div>
  );
};

export default PatientDashboard;
