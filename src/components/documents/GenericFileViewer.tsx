import React from 'react';
import { IDocument } from '../../models/IDocument';

type DocumentViewerType = IDocument & {
  id: string;
  title: string;
  original_file_name: string;
};

interface GenericFileViewerProps {
  document: DocumentViewerType;
  documentBlob: Blob;
}

const GenericFileViewer: React.FC<GenericFileViewerProps> = ({ document, documentBlob }) => {
  const downloadUrl = URL.createObjectURL(documentBlob);

  return (
    <div className="alert alert-info">
      <p>This document type ({document.original_file_name}) is not supported for viewing directly.</p>
      <a href={downloadUrl} download={document.original_file_name} className="btn btn-primary">
        Download File
      </a>
    </div>
  );
};

export default GenericFileViewer;