import React from 'react';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import UriPdfViewer from './UriPdfViewer';
import { useFetchDocumentQuery } from '../../service/DocumentService';

const DocumentViewerPage: React.FC = () => {
  const { id: documentId } = useParams<{ id?: string }>(); // optional type prevents non-null assertion

  const { data: document, error, isLoading } = useFetchDocumentQuery(documentId ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  if (!documentId) return <div>No document selected.</div>;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching document</div>;

  const documentUri = document?.uri;
  return (
    <div>
      <h1>Document Viewer</h1>
      {documentUri && <UriPdfViewer uri={documentUri} />}
    </div>
  );
};

export default DocumentViewerPage;