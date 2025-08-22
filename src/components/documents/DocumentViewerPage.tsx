import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchDocumentQuery } from '../../service/DocumentService';
import UriPdfViewer from './UriPdfViewer';
import DocumentLoader from './DocumentLoader';
import PdfLibViewer from './PdfLibViewer';

const DocumentViewerPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { data: documentResponse, error, isLoading } = useFetchDocumentQuery(documentId!);

  if (isLoading) {
    return <DocumentLoader />;
  }

  if (error) {
    return <div className="alert alert-danger">Error loading document</div>;
  }

  if (!documentResponse || !documentResponse.data) {
    return <div className="alert alert-warning">Document not found</div>;
  }

  const document = documentResponse.data;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <UriPdfViewer uri={document.uri} />
      <PdfLibViewer />
    </div>
  );
};

export default DocumentViewerPage;