import React from 'react';
import { useParams } from 'react-router-dom';
import UriPdfViewer from './UriPdfViewer';
import { documentsApiBaseUrl } from '../../utils/requestutils';

const DocumentViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const documentUrl = id ? `${documentsApiBaseUrl}/${id}/download` : '';

  return (
    <div>
      <h1>Document Viewer</h1>
      {documentUrl && <UriPdfViewer uri={documentUrl} />}
    </div>
  );
};

export default DocumentViewerPage;